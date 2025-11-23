"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type WebSocketMessage = {
    push?: {
        pub?: {
            data?: unknown
        }
    }
    connect?: unknown
    [key: string]: unknown
}

type WebSocketHookOptions = {
    reconnect?: boolean
    reconnectInterval?: number
    onOpen?: (send: (data: Record<string, unknown>) => void) => void
}

export function useWebSocket(
    url: string,
    { reconnect = false, reconnectInterval = 3000, onOpen }: WebSocketHookOptions = {}
) {
    const wsRef = useRef<WebSocket | null>(null)
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
    const onOpenRef = useRef(onOpen)

    useEffect(() => {
        onOpenRef.current = onOpen
    }, [onOpen])

    const [readyState, setReadyState] = useState<WebSocket["readyState"]>(
        typeof WebSocket === "undefined" ? 0 : WebSocket.CLOSED
    )
    const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
    const [messages, setMessages] = useState<WebSocketMessage[]>([])

    const sendRaw = useCallback((raw: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(raw)
        }
    }, [])

    const sendJson = useCallback((data: Record<string, unknown>) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(data))
        }
    }, [])

    const disconnect = useCallback(() => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current)
            reconnectTimeout.current = null
        }
        wsRef.current?.close()
    }, [])

    const connectRef = useRef<(() => void) | null>(null)

    const connect = useCallback(() => {
        if (typeof window === "undefined") return
        if (!url) return

        const ws = new WebSocket(url)
        wsRef.current = ws

        ws.onopen = () => {
            setReadyState(ws.readyState)
            if (onOpenRef.current) {
                onOpenRef.current(sendJson)
            }
        }

        ws.onmessage = (msg) => {
            setLastMessage(msg)
            if (msg?.data) {
                try {
                    const parsed = JSON.parse(msg.data) as WebSocketMessage

                    if (parsed?.push) {
                        setMessages((prev) => [parsed, ...prev])
                    }
                } catch (error) {
                    console.error("Failed to parse WebSocket message:", error)
                }
            }
        }

        ws.onerror = (error: Event) => {
            console.error(error)
            setReadyState(ws.readyState)
        }

        ws.onclose = (event: CloseEvent) => {
            console.log("WebSocket closed", event)
            setReadyState(ws.readyState)
            if (reconnect && connectRef.current) {
                reconnectTimeout.current = setTimeout(connectRef.current, reconnectInterval)
            }
        }
    }, [url, reconnect, reconnectInterval, sendJson])

    useEffect(() => {
        connectRef.current = connect
    }, [connect])

    useEffect(() => {
        connect()
        return () => disconnect()
    }, [connect, disconnect])

    return {
        readyState,
        lastMessage,
        sendJson,
        sendRaw,
        disconnect,
        messages,
    }
}
