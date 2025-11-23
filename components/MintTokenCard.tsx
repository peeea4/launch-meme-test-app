"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export type TokenItemDataType = {
    token: string
    tokenType: string
    supply: number
    decimals: number
    name: string
    symbol: string
    metadataUri: string
    creator: string
    hardcap: number
    marketCapUsd: number
    holders: number
    priceSol: number
    mint_time?: number
    pool?: string
    txCount?: number
    isMigrated?: boolean
    migrationPool?: string | null
    photo?: string
    description?: string | null
    website?: string | null
    x?: string | null
    telegram?: string | null
    lastTradeExecutionPositionKey?: string | null
    lastTradeId?: string | null
    priceUsd?: number
    buys?: number
    sells?: number
    volumeSol?: number
    volumeUsd?: number
    version?: number
    list_time?: number
    last_tx_time?: number
    progress?: number
    progressSol?: number
    _balanceSol?: number
    _balanceTokens?: number
    configAddress?: string | null
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

export default function MintTokenCard({
    name,
    symbol,
    token,
    tokenType,
    supply,
    decimals,
    creator,
    metadataUri,
    hardcap,
    marketCapUsd,
    holders,
    priceSol,
    mint_time,
    pool,
    txCount,
    isMigrated,
    migrationPool,
    description,
    website,
    x,
    telegram,
    priceUsd,
    buys,
    sells,
    volumeSol,
    volumeUsd,
    version,
    list_time,
    last_tx_time,
    progress,
    progressSol,
    _balanceSol,
    _balanceTokens,
    configAddress,
    lastTradeId,
}: TokenItemDataType) {
    const [photo, setPhoto] = useState<string | null>(null)

    useEffect(() => {
        if (!metadataUri) return

        fetch(metadataUri)
            .then((res) => res.json())
            .then((data: MetadataType) => {
                if (data.image && typeof data.image === "string" && data.image.trim() !== "") {
                    setPhoto(data.image)
                }
            })
            .catch((err) => {
                console.log("Failed to fetch metadata:", err)
            })
    }, [metadataUri])

    const formatNumber = (num: number | undefined) => {
        if (num === undefined || num === null) return "N/A"
        return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
    }

    const formatCurrency = (num: number | undefined) => {
        if (num === undefined || num === null) return "$0.00"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        }).format(num)
    }

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return "N/A"
        return new Date(timestamp).toLocaleString()
    }

    const formattedSupply = (supply / 10 ** decimals).toLocaleString()
    const progressPercent = progress !== undefined ? (progress * 100).toFixed(2) : "0.00"

    const isValidImageUrl =
        photo !== null &&
        photo !== undefined &&
        typeof photo === "string" &&
        photo.trim().length > 0

    return (
        <Card className="w-full max-w-4xl rounded-2xl shadow-lg p-6 bg-background backdrop-blur">
            <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-200">
                    {isValidImageUrl ? (
                        <img
                            src={photo}
                            alt={name || "Token image"}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                e.currentTarget.style.display = "none"
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                        </div>
                    )}
                </div>

                <div className="grow">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">{name}</h2>
                            <p className="text-lg text-gray-500 font-medium">{symbol}</p>
                            {description && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {description}
                                </p>
                            )}
                        </div>
                        {isMigrated && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Migrated
                            </span>
                        )}
                    </div>

                    {(website || x || telegram) && (
                        <div className="flex gap-2 mt-3">
                            {website && (
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    🌐 Website
                                </a>
                            )}
                            {x && (
                                <a
                                    href={`https://x.com/${x}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    🐦 Twitter
                                </a>
                            )}
                            {telegram && (
                                <a
                                    href={telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    💬 Telegram
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {progress !== undefined && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    {progressSol !== undefined && (
                        <div className="text-xs text-gray-500 mt-1">
                            {formatNumber(progressSol)} SOL / {formatNumber(hardcap)} SOL
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Price (SOL)</div>
                    <div className="text-lg font-bold">{formatNumber(priceSol)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Price (USD)</div>
                    <div className="text-lg font-bold">{formatCurrency(priceUsd)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Market Cap</div>
                    <div className="text-lg font-bold">{formatCurrency(marketCapUsd)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Holders</div>
                    <div className="text-lg font-bold">{formatNumber(holders)}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Volume (SOL)</div>
                    <div className="text-base font-semibold text-blue-700">
                        {formatNumber(volumeSol)}
                    </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Volume (USD)</div>
                    <div className="text-base font-semibold text-blue-700">
                        {formatCurrency(volumeUsd)}
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Buys</div>
                    <div className="text-base font-semibold text-green-700">
                        {formatNumber(buys)}
                    </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Sells</div>
                    <div className="text-base font-semibold text-red-700">
                        {formatNumber(sells)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                        Token Information
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Supply</span>
                            <span className="font-medium">{formattedSupply}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Type</span>
                            <span className="font-medium">{tokenType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Decimals</span>
                            <span className="font-medium">{decimals}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Hardcap</span>
                            <span className="font-medium">{formatNumber(hardcap)} SOL</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Version</span>
                            <span className="font-medium">{version || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Transactions</span>
                            <span className="font-medium">{formatNumber(txCount)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Addresses</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="text-gray-500 mb-1">Token</div>
                            <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                                {token}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 mb-1">Creator</div>
                            <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                                {creator}
                            </div>
                        </div>
                        {pool && (
                            <div>
                                <div className="text-gray-500 mb-1">Pool</div>
                                <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                                    {pool}
                                </div>
                            </div>
                        )}
                        {migrationPool && (
                            <div>
                                <div className="text-gray-500 mb-1">Migration Pool</div>
                                <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                                    {migrationPool}
                                </div>
                            </div>
                        )}
                        {configAddress && (
                            <div>
                                <div className="text-gray-500 mb-1">Config</div>
                                <div className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                                    {configAddress}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {(mint_time || list_time || last_tx_time) && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">Timestamps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {mint_time && (
                            <div>
                                <div className="text-gray-500 mb-1">Mint Time</div>
                                <div className="font-medium">{formatDate(mint_time)}</div>
                            </div>
                        )}
                        {list_time && (
                            <div>
                                <div className="text-gray-500 mb-1">List Time</div>
                                <div className="font-medium">{formatDate(list_time)}</div>
                            </div>
                        )}
                        {last_tx_time && (
                            <div>
                                <div className="text-gray-500 mb-1">Last Transaction</div>
                                <div className="font-medium">{formatDate(last_tx_time)}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(_balanceSol !== undefined || _balanceTokens !== undefined || lastTradeId) && (
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-sm text-gray-700 mb-3">Additional Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {_balanceSol !== undefined && (
                            <div>
                                <div className="text-gray-500 mb-1">Balance (SOL)</div>
                                <div className="font-medium">{formatNumber(_balanceSol)}</div>
                            </div>
                        )}
                        {_balanceTokens !== undefined && (
                            <div>
                                <div className="text-gray-500 mb-1">Balance (Tokens)</div>
                                <div className="font-medium">{formatNumber(_balanceTokens)}</div>
                            </div>
                        )}
                        {lastTradeId && (
                            <div>
                                <div className="text-gray-500 mb-1">Last Trade ID</div>
                                <div className="font-mono text-xs break-all">{lastTradeId}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Card>
    )
}
