"use client"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TokenItemDataType } from "@/types/token"

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

export default function TokenDetails(tokenData: TokenItemDataType) {
    const {
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
    } = tokenData

    const [photo, setPhoto] = useState<string | null>(null)

    useEffect(() => {
        // Иначе пытаемся загрузить из metadataUri
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
        <div className="space-y-6">
            <Card className="bg-card border-border p-6">
                <div className="flex gap-6 mb-6">
                    <div className="w-32 h-32 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
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
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="grow">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{name}</h1>
                                <p className="text-xl text-muted-foreground font-medium">
                                    {symbol}
                                </p>
                                {description && (
                                    <p className="text-sm text-muted-foreground mt-3">
                                        {description}
                                    </p>
                                )}
                            </div>
                            {isMigrated && (
                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                                    Migrated
                                </span>
                            )}
                        </div>

                        {(website || x || telegram) && (
                            <div className="flex gap-3 mt-4">
                                {website && (
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        🌐 Website
                                    </a>
                                )}
                                {x && (
                                    <a
                                        href={`https://x.com/${x}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        🐦 Twitter
                                    </a>
                                )}
                                {telegram && (
                                    <a
                                        href={telegram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
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
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progressPercent}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{
                                    width: `${parseInt(progressPercent) >= 100 ? 100 : progressPercent}%`,
                                }}
                            />
                        </div>
                        {progressSol !== undefined && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {formatNumber(progressSol)} SOL / {formatNumber(hardcap)} SOL
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Price (SOL)</div>
                        <div className="text-lg font-bold">{formatNumber(priceSol)}</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Price (USD)</div>
                        <div className="text-lg font-bold">{formatCurrency(priceUsd)}</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
                        <div className="text-lg font-bold">{formatCurrency(marketCapUsd)}</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Holders</div>
                        <div className="text-lg font-bold">{formatNumber(holders)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Volume (SOL)</div>
                        <div className="text-base font-semibold text-foreground">
                            {formatNumber(volumeSol)}
                        </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Volume (USD)</div>
                        <div className="text-base font-semibold text-foreground">
                            {formatCurrency(volumeUsd)}
                        </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Buys</div>
                        <div className="text-base font-semibold text-foreground">
                            {formatNumber(buys)}
                        </div>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Sells</div>
                        <div className="text-base font-semibold text-foreground">
                            {formatNumber(sells)}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border p-6">
                    <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2 mb-4">
                        Token Information
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Supply</span>
                            <span className="font-medium text-foreground">{formattedSupply}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium text-foreground">{tokenType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Decimals</span>
                            <span className="font-medium text-foreground">{decimals}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Hardcap</span>
                            <span className="font-medium text-foreground">
                                {formatNumber(hardcap)} SOL
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Version</span>
                            <span className="font-medium text-foreground">{version || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Transactions</span>
                            <span className="font-medium text-foreground">
                                {formatNumber(txCount)}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-card border-border p-6">
                    <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2 mb-4">
                        Addresses
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="text-muted-foreground mb-1">Token</div>
                            <div className="font-mono text-xs break-all bg-muted p-2 rounded border border-border">
                                {token}
                            </div>
                        </div>
                        <div>
                            <div className="text-muted-foreground mb-1">Creator</div>
                            <div className="font-mono text-xs break-all bg-muted p-2 rounded border border-border">
                                {creator}
                            </div>
                        </div>
                        {pool && (
                            <div>
                                <div className="text-muted-foreground mb-1">Pool</div>
                                <div className="font-mono text-xs break-all bg-muted p-2 rounded border border-border">
                                    {pool}
                                </div>
                            </div>
                        )}
                        {migrationPool && (
                            <div>
                                <div className="text-muted-foreground mb-1">Migration Pool</div>
                                <div className="font-mono text-xs break-all bg-muted p-2 rounded border border-border">
                                    {migrationPool}
                                </div>
                            </div>
                        )}
                        {configAddress && (
                            <div>
                                <div className="text-muted-foreground mb-1">Config</div>
                                <div className="font-mono text-xs break-all bg-muted p-2 rounded border border-border">
                                    {configAddress}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {(mint_time || list_time || last_tx_time) && (
                <Card className="bg-card border-border p-6">
                    <h3 className="font-semibold text-sm text-foreground mb-4">Timestamps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {!!mint_time && (
                            <div>
                                <div className="text-muted-foreground mb-1">Mint Time</div>
                                <div className="font-medium text-foreground">
                                    {formatDate(mint_time)}
                                </div>
                            </div>
                        )}
                        {!!list_time && (
                            <div>
                                <div className="text-muted-foreground mb-1">List Time</div>
                                <div className="font-medium text-foreground">
                                    {formatDate(list_time)}
                                </div>
                            </div>
                        )}
                        {!!last_tx_time && (
                            <div>
                                <div className="text-muted-foreground mb-1">Last Transaction</div>
                                <div className="font-medium text-foreground">
                                    {formatDate(last_tx_time)}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {(_balanceSol !== undefined || _balanceTokens !== undefined || lastTradeId) && (
                <Card className="bg-card border-border p-6">
                    <h3 className="font-semibold text-sm text-foreground mb-4">Additional Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        {_balanceSol !== undefined && (
                            <div>
                                <div className="text-muted-foreground mb-1">Balance (SOL)</div>
                                <div className="font-medium text-foreground">
                                    {formatNumber(_balanceSol)}
                                </div>
                            </div>
                        )}
                        {_balanceTokens !== undefined && (
                            <div>
                                <div className="text-muted-foreground mb-1">Balance (Tokens)</div>
                                <div className="font-medium text-foreground">
                                    {formatNumber(_balanceTokens)}
                                </div>
                            </div>
                        )}
                        {lastTradeId && (
                            <div>
                                <div className="text-muted-foreground mb-1">Last Trade ID</div>
                                <div className="font-mono text-xs break-all text-foreground">
                                    {lastTradeId}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
