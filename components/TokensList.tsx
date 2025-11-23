"use client"
import { useWebSocket } from "@/hooks/use-websocket"
import { useEffect, useCallback, useRef, useState, startTransition } from "react"
import MintTokenCard, { type TokenItemDataType } from "./MintTokenCard"

const WS_URL = "wss://launch.meme/connection/websocket"

type WebSocketConnectResponse = {
    connect?: unknown
    [key: string]: unknown
}

type WebSocketPushMessage = {
    push?: {
        pub?: {
            data?: TokenItemDataType
        }
    }
    [key: string]: unknown
}

export const TokensList = () => {
    const hasSubscribedRef = useRef(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleOpen = useCallback((send: (data: Record<string, unknown>) => void) => {
        send({
            connect: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3d3ciLCJpYXQiOjE3NDc5MDU4MTF9.Dgx3msdlTcunO_a61TkhK1957cDqPtY6ODyVDOknHZw",
                name: "js",
            },
            id: 1,
        })
    }, [])

    const { lastMessage, sendJson, messages } = useWebSocket(WS_URL, {
        onOpen: handleOpen,
    })

    // Обработка пустого объекта {} - отправляем обратно {}
    useEffect(() => {
        if (!lastMessage?.data) return

        try {
            const parsed = JSON.parse(lastMessage.data as string)

            // Если получили пустой объект, отправляем обратно пустой объект
            if (typeof parsed === "object" && parsed !== null && Object.keys(parsed).length === 0) {
                sendJson({})
            }
        } catch {
            // Игнорируем ошибки парсинга для этой логики
        }
    }, [lastMessage, sendJson])

    // Обработка ответа на подключение и подписка на канал
    useEffect(() => {
        if (!lastMessage?.data || hasSubscribedRef.current) return

        try {
            const parsed = JSON.parse(lastMessage.data as string) as WebSocketConnectResponse

            // Если получили ответ на connect, подписываемся на канал
            if (parsed.connect && !hasSubscribedRef.current) {
                hasSubscribedRef.current = true
                startTransition(() => {
                    setIsSubscribed(true)
                })
                sendJson({ subscribe: { channel: "pumpfun-mintTokens" }, id: 2 })
            }
        } catch (error) {
            console.error("Failed to parse connection response:", error)
        }
    }, [lastMessage, sendJson])

    const tokenMessages = messages.filter((message): message is WebSocketPushMessage =>
        Boolean(message.push?.pub?.data)
    )

    const getTokenKey = (data: TokenItemDataType, index: number): string => {
        return `${data.creator}-${data.token}-${index}`
    }

    return (
        <div className="flex flex-col gap-4">
            {tokenMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    {isSubscribed ? "Waiting for new tokens..." : "Connecting..."}
                </div>
            ) : (
                tokenMessages.map((message, index) => {
                    const tokenData = message.push?.pub?.data
                    if (!tokenData) return null

                    return <MintTokenCard key={getTokenKey(tokenData, index)} {...tokenData} />
                })
            )}
        </div>
    )
}
