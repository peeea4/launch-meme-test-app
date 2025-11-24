"use client"
import { useWebSocket } from "@/hooks/use-websocket"
import { TokenItemDataType } from "@/types/token"
import { useEffect, useCallback, useRef, useState, startTransition } from "react"

import TokensTable from "./Table/TokensTable"

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

    const { lastMessage, sendJson, messages, readyState } = useWebSocket(WS_URL, {
        onOpen: handleOpen,
    })

    useEffect(() => {
        if (!lastMessage?.data) return

        try {
            const parsed = JSON.parse(lastMessage.data as string)

            if (typeof parsed === "object" && parsed !== null && Object.keys(parsed).length === 0) {
                sendJson({})
            }
        } catch {}
    }, [lastMessage, sendJson])

    useEffect(() => {
        if (!lastMessage?.data || hasSubscribedRef.current) return

        try {
            const parsed = JSON.parse(lastMessage.data as string) as WebSocketConnectResponse

            if (parsed.connect && !hasSubscribedRef.current) {
                hasSubscribedRef.current = true
                startTransition(() => {
                    setIsSubscribed(true)
                })
                sendJson({ subscribe: { channel: "pumpfun-mintTokens" }, id: 2 })

                sendJson({ subscribe: { channel: "pumpfun-tokenUpdates" }, id: 3 })
            }
        } catch (error) {
            console.error("Failed to parse connection response:", error)
        }
    }, [lastMessage, sendJson])

    const tokenMessages = messages.filter((message): message is WebSocketPushMessage =>
        Boolean(message?.push?.channel === "pumpfun-mintTokens")
    )

    return (
        <div className="flex flex-col gap-4 items-center w-full px-4">
            <div>Connection: {readyState === 1 ? 'Имеется': 'Сдох'}</div>
            {tokenMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    {isSubscribed ? "Waiting for new tokens..." : "Connecting..."}
                </div>
            ) : (
                <TokensTable tokens={tokenMessages} />
            )}
        </div>
    )
}
