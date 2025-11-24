"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type WebSocketMessage = {
    push?: {
        channel?: string
        pub?: {
            data?: any
        }
    }
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

    // ✔ Храним отображаемые сообщения
    const [messages, setMessages] = useState<WebSocketMessage[]>([])

    // ✔ Map для O(1) поиска токена
    const indexMap = useRef<Map<string, number>>(new Map())

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
        reconnectTimeout.current && clearTimeout(reconnectTimeout.current)
        wsRef.current?.close()
    }, [])

    const connectRef = useRef<() => void>(() => {})

    const connect = useCallback(() => {
        if (typeof window === "undefined" || !url) return

        const ws = new WebSocket(url)
        wsRef.current = ws

        ws.onopen = () => {
            setReadyState(ws.readyState)
            onOpenRef.current?.(sendJson)
        }

        ws.onmessage = (msg) => {
            setLastMessage(msg)
            if (msg.data)
                try {
                    const parsed = JSON.parse(msg.data) as WebSocketMessage
                    if (!parsed?.push) return

                    const channel = parsed.push.channel
                    const data = parsed.push.pub?.data
                    const token = data?.token

                    if (!token) return

                    // -----------------------
                    // 🟢 NEW TOKEN
                    // -----------------------
                    if (channel === "pumpfun-mintTokens") {
                        setMessages((prev) => {
                            const next = [parsed, ...prev]
                            // записываем index в Map
                            indexMap.current.set(token, 0)

                            // сдвигаем индексы всех старых токенов
                            for (const [t, i] of indexMap.current.entries()) {
                                if (t !== token) {
                                    indexMap.current.set(t, i + 1)
                                }
                            }

                            return next
                        })
                    }

                    // -----------------------
                    // 🟡 UPDATE TOKEN
                    // -----------------------
                    if (channel === "pumpfun-tokenUpdates") {
                        const idx = indexMap.current.get(token)
                        if (idx === undefined) return

                        setMessages((prev) => {
                            const next = [...prev] // копия
                            next[idx] = {
                                ...next[idx],
                                push: {
                                    ...next[idx]?.push,
                                    pub: {
                                        ...next[idx]?.push?.pub,
                                        data: {
                                            ...next[idx]?.push?.pub?.data,
                                            ...data, // только обновление
                                        },
                                    },
                                },
                            }
                            return next
                        })
                    }
                } catch (error) {
                    console.error("WS parse error:", error)
                }
        }

        ws.onerror = () => setReadyState(ws.readyState)

        ws.onclose = () => {
            setReadyState(ws.readyState)
            if (reconnect) {
                reconnectTimeout.current = setTimeout(connect, reconnectInterval)
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
        messages,
        sendJson,
        sendRaw,
        disconnect,
    }
}
