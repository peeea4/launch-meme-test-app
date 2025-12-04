import { create } from "zustand"
import { TokenItemDataType } from "@/types/token"

type WebSocketPushMessage = {
    push?: {
        channel?: string
        pub?: {
            data?: TokenItemDataType
        }
    }
    [key: string]: unknown
}

type MetadataType = {
    name: string
    symbol: string
    description: string | null
    image: string
    showName?: boolean
    createdOn?: string
    twitter?: string
    website?: string
}

interface TokensStore {
    messages: WebSocketPushMessage[]
    imageCache: Map<string, string | null>
    isLoadingImage: Map<string, boolean>
    tokenIndexMap: Map<string, number>
    pendingUpdates: Map<string, Partial<TokenItemDataType>>
    updateBatchTimeout: NodeJS.Timeout | null
    addMessage: (message: WebSocketPushMessage) => void
    updateMessage: (token: string, data: Partial<TokenItemDataType>) => void
    flushPendingUpdates: () => void
    getImage: (metadataUri: string, token: string) => Promise<string | null>
    clearCache: () => void
}

const hasTokenDataChanged = (
    oldData: TokenItemDataType | undefined,
    newData: Partial<TokenItemDataType>
): boolean => {
    if (!oldData) return true

    return (
        oldData.volumeUsd !== newData.volumeUsd ||
        oldData.marketCapUsd !== newData.marketCapUsd ||
        oldData.holders !== newData.holders ||
        oldData.progress !== newData.progress ||
        oldData.name !== newData.name ||
        oldData.symbol !== newData.symbol ||
        oldData.metadataUri !== newData.metadataUri
    )
}

export const useTokensStore = create<TokensStore>((set, get) => ({
    messages: [],
    imageCache: new Map(),
    isLoadingImage: new Map(),
    tokenIndexMap: new Map(),
    pendingUpdates: new Map(),
    updateBatchTimeout: null,

    addMessage: (message) => {
        set((state) => {
            const tokenData = message.push?.pub?.data
            if (!tokenData?.token) return state

            const token = tokenData.token
            const existingIndex = state.tokenIndexMap.get(token)

            if (
                existingIndex !== undefined &&
                existingIndex >= 0 &&
                existingIndex < state.messages.length
            ) {
                const existingData = state.messages[existingIndex]?.push?.pub?.data
                if (!hasTokenDataChanged(existingData, tokenData)) {
                    return state
                }

                const next = [...state.messages]
                next[existingIndex] = message
                return { messages: next }
            }

            const next = [...state.messages, message]
            const nextIndexMap = new Map(state.tokenIndexMap)
            nextIndexMap.set(token, next.length - 1)
            return { messages: next, tokenIndexMap: nextIndexMap }
        })
    },

    updateMessage: (token, data) => {
        const state = get()

        const nextPending = new Map(state.pendingUpdates)
        const existingPending = nextPending.get(token) || {}
        nextPending.set(token, { ...existingPending, ...data })

        set({ pendingUpdates: nextPending })

        if (state.updateBatchTimeout) {
            clearTimeout(state.updateBatchTimeout)
        }

        const timeout = setTimeout(() => {
            get().flushPendingUpdates()
        }, 50)

        set({ updateBatchTimeout: timeout })
    },

    flushPendingUpdates: () => {
        const state = get()
        if (state.pendingUpdates.size === 0) return

        const updates = new Map(state.pendingUpdates)
        set({ pendingUpdates: new Map(), updateBatchTimeout: null })

        set((currentState) => {
            let hasChanges = false
            const next = [...currentState.messages]

            updates.forEach((data, token) => {
                const index = currentState.tokenIndexMap.get(token)
                if (index === undefined || index < 0 || index >= next.length) {
                    return
                }

                const existingMsg = next[index]
                const existingData = existingMsg?.push?.pub?.data

                if (!hasTokenDataChanged(existingData, data)) {
                    return
                }

                hasChanges = true
                next[index] = {
                    ...existingMsg,
                    push: {
                        ...existingMsg.push,
                        pub: {
                            ...existingMsg.push?.pub,
                            data: {
                                ...existingData,
                                ...data,
                            } as TokenItemDataType,
                        },
                    },
                }
            })

            return hasChanges ? { messages: next } : currentState
        })
    },

    getImage: async (metadataUri, token) => {
        if (!metadataUri) return null

        const state = get()

        if (state.imageCache.has(metadataUri)) {
            return state.imageCache.get(metadataUri) ?? null
        }

        if (state.isLoadingImage.get(metadataUri)) {
            return new Promise((resolve) => {
                let attempts = 0
                const maxAttempts = 200
                const checkInterval = setInterval(() => {
                    attempts++
                    const currentState = get()
                    if (!currentState.isLoadingImage.get(metadataUri) || attempts >= maxAttempts) {
                        clearInterval(checkInterval)
                        resolve(currentState.imageCache.get(metadataUri) ?? null)
                    }
                }, 50)
            })
        }

        set((state) => {
            const next = new Map(state.isLoadingImage)
            next.set(metadataUri, true)
            return { isLoadingImage: next }
        })

        try {
            const response = await fetch(metadataUri, {
                cache: "force-cache",
            })
            if (!response.ok) {
                throw new Error("Failed to fetch metadata")
            }
            const metadata: MetadataType = await response.json()

            const imageUrl =
                metadata.image && typeof metadata.image === "string" && metadata.image.trim() !== ""
                    ? metadata.image
                    : null

            set((state) => {
                const nextCache = new Map(state.imageCache)
                nextCache.set(metadataUri, imageUrl)
                const nextLoading = new Map(state.isLoadingImage)
                nextLoading.set(metadataUri, false)
                return { imageCache: nextCache, isLoadingImage: nextLoading }
            })

            return imageUrl
        } catch (error) {
            console.error("Failed to fetch metadata:", error)
            set((state) => {
                const nextCache = new Map(state.imageCache)
                nextCache.set(metadataUri, null)
                const nextLoading = new Map(state.isLoadingImage)
                nextLoading.set(metadataUri, false)
                return { imageCache: nextCache, isLoadingImage: nextLoading }
            })
            return null
        }
    },

    clearCache: () => {
        const state = get()
        if (state.updateBatchTimeout) {
            clearTimeout(state.updateBatchTimeout)
        }
        set({
            imageCache: new Map(),
            isLoadingImage: new Map(),
            tokenIndexMap: new Map(),
            pendingUpdates: new Map(),
            updateBatchTimeout: null,
        })
    },
}))

export const useTokensMessages = () => useTokensStore((state) => state.messages)
