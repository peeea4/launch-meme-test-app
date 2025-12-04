import { create } from "zustand"

type WebSocketStore = {
    ws: WebSocket | null
    readyState: number
    lastMessage: MessageEvent | null
    isConnected: boolean
    isSubscribed: boolean
    reconnectTimeout: NodeJS.Timeout | null
    onOpenCallback: ((send: (data: Record<string, unknown>) => void) => void) | null
    wsUrl: string | null

    connect: (url: string, onOpen?: (send: (data: Record<string, unknown>) => void) => void) => void
    disconnect: () => void
    sendJson: (data: Record<string, unknown>) => void
    sendRaw: (raw: string) => void
    setLastMessage: (message: MessageEvent | null) => void
    setIsSubscribed: (value: boolean) => void
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    ws: null,
    readyState: typeof WebSocket === "undefined" ? 0 : WebSocket.CLOSED,
    lastMessage: null,
    isConnected: false,
    isSubscribed: false,
    reconnectTimeout: null,
    onOpenCallback: null,
    wsUrl: null,

    connect: (url, onOpen) => {
        if (typeof window === "undefined") return

        const state = get()

        if (state.ws && state.ws.readyState === WebSocket.OPEN && state.wsUrl === url) {
            if (onOpen) {
                set({ onOpenCallback: onOpen })
            }
            return
        }

        set({ wsUrl: url, onOpenCallback: onOpen || null })

        if (state.ws) {
            state.ws.close()
        }

        if (state.reconnectTimeout) {
            clearTimeout(state.reconnectTimeout)
        }

        const ws = new WebSocket(url)

        ws.onopen = () => {
            set({ readyState: ws.readyState, isConnected: true })

            const currentState = get()
            if (currentState.onOpenCallback) {
                const sendJson = (data: Record<string, unknown>) => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify(data))
                    }
                }
                currentState.onOpenCallback(sendJson)
            }
        }

        ws.onmessage = (msg) => {
            set({ lastMessage: msg })
        }

        ws.onerror = () => {
            set({ readyState: ws.readyState, isConnected: false })
        }

        ws.onclose = () => {
            set({ readyState: ws.readyState, isConnected: false })

            const currentState = get()
            if (currentState.wsUrl) {
                const timeout = setTimeout(() => {
                    const state = get()
                    if (!state.isConnected && state.wsUrl) {
                        get().connect(state.wsUrl, state.onOpenCallback || undefined)
                    }
                }, 3000)

                set({ reconnectTimeout: timeout })
            }
        }

        set({ ws })
    },

    disconnect: () => {
        const state = get()
        if (state.reconnectTimeout) {
            clearTimeout(state.reconnectTimeout)
        }
        if (state.ws) {
            state.ws.close()
        }
        set({
            ws: null,
            readyState: WebSocket.CLOSED,
            isConnected: false,
            reconnectTimeout: null,
            wsUrl: null,
            onOpenCallback: null,
        })
    },

    sendJson: (data) => {
        const state = get()
        if (state.ws?.readyState === WebSocket.OPEN) {
            state.ws.send(JSON.stringify(data))
        }
    },

    sendRaw: (raw) => {
        const state = get()
        if (state.ws?.readyState === WebSocket.OPEN) {
            state.ws.send(raw)
        }
    },

    setLastMessage: (message) => {
        set({ lastMessage: message })
    },

    setIsSubscribed: (value) => {
        set({ isSubscribed: value })
    },
}))
