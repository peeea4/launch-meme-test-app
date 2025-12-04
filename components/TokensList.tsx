"use client"
import { useWebSocketStore } from "@/store/websocket-store"
import { useTokensMessages, useTokensStore } from "@/store/tokens-store"
import { TokenItemDataType } from "@/types/token"
import { startTransition, useEffect, useMemo, useRef } from "react"

import { SearchInput } from "./SearchInput"
import TokensTable from "./Table/TokensTable"
import { LoaderFour } from "./ui/loader"

type WebSocketConnectResponse = {
    connect?: unknown
    [key: string]: unknown
}

type WebSocketPushMessage = {
    push?: {
        channel?: string
        pub?: {
            data?: TokenItemDataType
        }
    }
    [key: string]: unknown
}

export const TokensList = () => {
    const hasSubscribedRef = useRef(false)
    const { lastMessage, sendJson, isSubscribed, connect, isConnected } = useWebSocketStore()
    const messages = useTokensMessages()
    const addMessage = useTokensStore((state) => state.addMessage)
    const updateMessage = useTokensStore((state) => state.updateMessage)

    const subscribeToChannels = () => {
        const currentSendJson = useWebSocketStore.getState().sendJson
        currentSendJson({ subscribe: { channel: "pumpfun-mintTokens" }, id: 2 })
        currentSendJson({ subscribe: { channel: "pumpfun-tokenUpdates" }, id: 3 })
        hasSubscribedRef.current = true
        useWebSocketStore.getState().setIsSubscribed(true)
    }

    useEffect(() => {
        if (typeof window === "undefined") return

        const state = useWebSocketStore.getState()

        if (state.isConnected && state.ws?.readyState === WebSocket.OPEN) return

        const handleOpen = (send: (data: Record<string, unknown>) => void) => {
            send({
                connect: {
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3d3ciLCJpYXQiOjE3NDc5MDU4MTF9.Dgx3msdlTcunO_a61TkhK1957cDqPtY6ODyVDOknHZw",
                    name: "js",
                },
                id: 1,
            })
        }
        connect("wss://launch.meme/connection/websocket", handleOpen)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isConnected) {
            hasSubscribedRef.current = false
            useWebSocketStore.getState().setIsSubscribed(false)
        }
    }, [isConnected])

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
        if (!lastMessage?.data) return

        try {
            const parsed = JSON.parse(lastMessage.data as string) as WebSocketConnectResponse

            if (parsed.connect) {
                startTransition(() => {
                    setTimeout(() => {
                        subscribeToChannels()
                    }, 100)
                })
            }
        } catch (error) {
            console.error("Failed to parse connection response:", error)
        }
    }, [lastMessage])

    useEffect(() => {
        if (!lastMessage?.data) return

        try {
            const parsed = JSON.parse(lastMessage.data as string) as WebSocketPushMessage

            if (!parsed?.push) return

            const channel = parsed.push.channel
            const data = parsed.push.pub?.data
            const token = data?.token

            if (!token) return

            if (channel === "pumpfun-mintTokens") {
                addMessage(parsed)
            }

            if (channel === "pumpfun-tokenUpdates") {
                updateMessage(token, data)
            }
        } catch {}
    }, [lastMessage, addMessage, updateMessage])

    const tokenMessages = useMemo(
        () =>
            (messages as WebSocketPushMessage[])
                .filter((message): message is WebSocketPushMessage =>
                    Boolean(message?.push?.channel === "pumpfun-mintTokens")
                )
                .reverse(),
        [messages]
    )

    if (tokenMessages.length === 0 || !isConnected)
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-[calc(100vh-96px)] px-4">
                <div className="text-center text-4xl text-gray-500 py-8 w-full">
                    <LoaderFour
                        text={
                            !isConnected
                                ? "Connecting..."
                                : isSubscribed
                                  ? "Waiting for new tokens..."
                                  : "Subscribing..."
                        }
                    />
                </div>
            </div>
        )

    return (
        <div className="flex flex-col gap-4 items-center w-full px-4">
            <SearchInput />
            <TokensTable tokens={tokenMessages} />
        </div>
    )
}
