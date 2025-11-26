"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { TokenDetails } from "./TokenDetails"
import { TokenItemDataType } from "@/types/token"

const API_URL = "/api/tokens"

type ApiTokenResponse = {
    tokens: {
        [key: string]: {
            version?: number
            token: string
            tokenType: string
            supply: number
            decimals: number
            mint_time?: number
            name: string
            symbol: string
            metadataUri: string
            photo?: string
            description?: string | null
            website?: string | null
            x?: string | null
            telegram?: string | null
            creator: string
            pool?: string
            hardcap: number
            list_time?: number
            isMigrated?: boolean
            migrationPool?: string | null
            lastTradeId?: string
            lastTradeExecutionPositionKey?: string | null
            priceSol: number
            priceUsd?: number
            marketCapUsd: number
            progress?: number
            progressSol?: number
            _balanceSol?: number
            _balanceTokens?: number
            last_tx_time?: number
            buys?: number
            sells?: number
            txCount?: number
            holders: number
            volumeSol?: number
            volumeUsd?: number
            configAddress?: string | null
        }
    }
    holders?: Array<{
        wallet: string
        amount: number
        percentage: number
        _id: string
    }>
}

export function TokenDetailsPageClient({ tokenAddress }: { tokenAddress: string }) {
    const router = useRouter()
    const [tokenData, setTokenData] = useState<TokenItemDataType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTokenData = useCallback(
        async (isInitialLoad = false) => {
            if (isInitialLoad) {
                setIsLoading(true)
            }
            setError(null)

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: tokenAddress }),
                    next: { revalidate: 10 },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data: ApiTokenResponse = await response.json()

                const tokenKey = Object.keys(data.tokens)[0]
                const apiToken = data.tokens[tokenKey]

                if (!apiToken) {
                    throw new Error("Token not found in response")
                }

                const tokenData: TokenItemDataType = {
                    token: apiToken.token,
                    tokenType: apiToken.tokenType,
                    supply: apiToken.supply,
                    decimals: apiToken.decimals,
                    name: apiToken.name,
                    symbol: apiToken.symbol,
                    metadataUri: apiToken.metadataUri,
                    creator: apiToken.creator,
                    hardcap: apiToken.hardcap,
                    marketCapUsd: apiToken.marketCapUsd,
                    holders: apiToken.holders,
                    priceSol: apiToken.priceSol,
                    mint_time: apiToken.mint_time,
                    pool: apiToken.pool,
                    txCount: apiToken.txCount,
                    isMigrated: apiToken.isMigrated,
                    migrationPool: apiToken.migrationPool,
                    photo: apiToken.photo,
                    description: apiToken.description,
                    website: apiToken.website,
                    x: apiToken.x,
                    telegram: apiToken.telegram,
                    lastTradeExecutionPositionKey: apiToken.lastTradeExecutionPositionKey,
                    lastTradeId: apiToken.lastTradeId,
                    priceUsd: apiToken.priceUsd,
                    buys: apiToken.buys,
                    sells: apiToken.sells,
                    volumeSol: apiToken.volumeSol,
                    volumeUsd: apiToken.volumeUsd,
                    version: apiToken.version,
                    list_time: apiToken.list_time,
                    last_tx_time: apiToken.last_tx_time,
                    progress: apiToken.progress,
                    progressSol: apiToken.progressSol,
                    _balanceSol: apiToken._balanceSol,
                    _balanceTokens: apiToken._balanceTokens,
                    configAddress: apiToken.configAddress,
                }

                setTokenData(tokenData)
            } catch (err) {
                console.error("Failed to fetch token data:", err)
                setError(err instanceof Error ? err.message : "Не удалось загрузить данные токена")
            } finally {
                if (isInitialLoad) {
                    setIsLoading(false)
                }
            }
        },
        [tokenAddress]
    )

    // Первоначальная загрузка данных
    useEffect(() => {
        if (tokenAddress) {
            fetchTokenData(true)
        }
    }, [tokenAddress, fetchTokenData])

    // Автоматическое обновление каждые 10 секунд через ревалидацию Next.js
    useEffect(() => {
        if (!tokenAddress) return

        const intervalId = setInterval(() => {
            // Используем router.refresh() для ревалидации страницы через Next.js
            router.refresh()
            // Также обновляем данные напрямую
            fetchTokenData(false)
        }, 10000) // 10 секунд

        return () => {
            clearInterval(intervalId)
        }
    }, [tokenAddress, fetchTokenData, router])

    if (isLoading) {
        return <div className="text-center text-muted-foreground py-8">Загрузка...</div>
    }

    if (error) {
        return (
            <div className="text-center text-destructive py-8">
                <p className="mb-2">Ошибка загрузки данных</p>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        )
    }

    if (!tokenData) {
        return (
            <div className="text-center text-muted-foreground py-8">Данные токена не найдены</div>
        )
    }

    return <TokenDetails {...tokenData} />
}
