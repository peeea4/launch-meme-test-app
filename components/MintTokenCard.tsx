"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

export default function MintTokenCard({
    name,
    symbol,
    token,
    metadataUri,
    hardcap,
    marketCapUsd,
    holders,
    priceSol,
    isMigrated,
    description,
    website,
    x,
    telegram,
    priceUsd,
    progress,
    progressSol,
}: TokenItemDataType) {
    const router = useRouter()
    const [photo, setPhoto] = useState<string | null>(null)

    const handleCardClick = () => {
        router.push(`/${token}`)
    }

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

    const progressPercent = progress !== undefined ? (progress * 100).toFixed(2) : "0.00"

    const isValidImageUrl =
        photo !== null &&
        photo !== undefined &&
        typeof photo === "string" &&
        photo.trim().length > 0

    return (
        <Card
            className="w-full max-w-5xl rounded-2xl shadow-lg p-6 bg-background backdrop-blur cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleCardClick}
        >
            <div className="flex gap-4 mb-6">
                <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-background border border-primary">
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
                            <h2 className="text-2xl font-bold mb-1">{name}</h2>
                            <p className="text-lg text-muted-foreground font-medium">{symbol}</p>
                            {description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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
                                    className="text-sm text-primary hover:underline"
                                    onClick={(e) => e.stopPropagation()}
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
                                    onClick={(e) => e.stopPropagation()}
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
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    💬 Telegram
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            {progress !== undefined && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    {progressSol !== undefined && (
                        <div className="text-xs text-muted-foreground mt-1">
                            {formatNumber(progressSol)} SOL / {formatNumber(hardcap)} SOL
                        </div>
                    )}
                </div>
            )}
        </Card>
    )
}
