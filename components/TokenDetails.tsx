/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { LineChart, Line, XAxis, CartesianGrid, LabelList } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TokenItemDataType } from "@/types/token"
import { ShootingStars } from "./ui/shooting-stars"
import { StarsBackground } from "./ui/stars-background"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

const chartData = [
    { month: "January", price: 50000000 },
    { month: "February", price: 75000000 },
    { month: "March", price: 68000000 },
    { month: "April", price: 42000000 },
    { month: "May", price: 60000000 },
    { month: "June", price: 63000000 },
]

const formatChartValue = (value: number): string => {
    if (value >= 1_000_000_000) {
        return (value / 1_000_000_000).toFixed(2) + "B"
    }
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(2) + "M"
    }
    if (value >= 1_000) {
        return (value / 1_000).toFixed(2) + "K"
    }
    return value.toString()
}

const chartConfig = {
    desktop: {
        label: "Market cap $",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const FALLBACK_IMAGE = "/mnt/data/65bffb7b-9aeb-44fe-bfbf-a2a30602a4cb.png"

type Props = TokenItemDataType

export const TokenDetails = (props: Props) => {
    const { name, symbol, priceUsd, holders, marketCapUsd, description, metadataUri, token } = props

    const [photo, setPhoto] = useState<string | null>(null)

    useEffect(() => {
        if (!metadataUri) return
        fetch(metadataUri)
            .then((res) => res.json())
            .then((data: any) => {
                if (data.image && typeof data.image === "string") setPhoto(data.image)
            })
            .catch(() => {})
    }, [metadataUri])

    const isValidImage = photo && photo.trim().length > 0

    const formatCurrency = (num?: number | null) =>
        num !== undefined && num !== null
            ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
              }).format(num)
            : "—"

    const formatNumber = (num?: number | null) =>
        num !== undefined && num !== null ? num.toLocaleString() : "—"

    return (
        <div className="min-h-[calc(100vh-96px)] text-slate-100 px-6 py-10 z-10 relative">
            <div className="max-w-7xl mx-auto flex flex-col md:grid grid-cols-12 gap-6 rounded-2xl border p-10 bg-card relative z-10">
                <section className="col-span-8 space-y-6">
                    <Card className="bg-linear-to-br from-primary/1 to-primary/20 p-6 h-full">
                        <div className="flex flex-col md:flex-row items-start gap-6 h-full">
                            <div className="w-40 h-40 relative flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10">
                                <Image
                                    src={isValidImage ? photo! : FALLBACK_IMAGE}
                                    alt={name}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-semibold">{name}</h1>
                                    <span className="text-slate-400 text-base ml-2">{symbol}</span>
                                </div>
                                <Badge className="ml-auto">
                                    {token.slice(0, 5)}...{token.slice(token.length - 5)}
                                </Badge>
                                <p className="text-slate-300 mt-2 max-w-[70%]">
                                    {description ?? "Description not provided."}
                                </p>

                                <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-400">Price</span>
                                        <div className="text-lg font-medium">
                                            {formatCurrency(priceUsd ?? undefined)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-400">Market cap</span>
                                        <div className="text-lg font-medium">
                                            {formatCurrency(marketCapUsd ?? undefined)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-400">Holders</span>
                                        <div className="text-lg font-medium">
                                            {formatNumber(holders)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
                <div className="col-span-4 space-y-6 h-full">
                    <Card className="p-5 bg-primary/5 h-full">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-slate-400">Mindshare</div>
                                <div className="text-xl font-semibold mt-1">0.03%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-slate-400">Followers</div>
                                <div className="text-xl font-semibold mt-1">75,929</div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="text-sm text-slate-300 font-semibold">
                                Unique Value Proposition
                            </h4>
                            <p className="text-sm text-slate-400 mt-3">
                                A self-custodial neobank that unifies spending, trading, and earning
                                across all chains — gasless, bridge-less, and custodial-free.
                            </p>
                        </div>
                    </Card>
                </div>
                <Card className="col-span-5 bg-background">
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 20,
                                    left: 32,
                                    right: 32,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="line" />}
                                />
                                <Line
                                    dataKey="price"
                                    type="natural"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-desktop)",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                >
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                        formatter={formatChartValue}
                                    />
                                </Line>
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-7 bg-linear-to-br from-primary/15 to-primary/0 p-6 rounded-2xl shadow-lg border border-primary/30">
                    <h4 className="text-lg font-semibold text-slate-200 mb-5 border-b border-primary/40 pb-2">
                        Token Metrics
                    </h4>
                    <div className="space-y-4 text-slate-300 text-sm">
                        <div className="flex justify-between border-b border-primary/20 pb-2">
                            <span>24h Trading Volume</span>
                            <span className="font-mono font-semibold text-white">$14,500,000</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/20 pb-2">
                            <span>Market Share</span>
                            <span className="font-mono font-semibold text-white">0.15%</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/20 pb-2">
                            <span>Transactions (24h)</span>
                            <span className="font-mono font-semibold text-white">25,000</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/20 pb-2">
                            <span>Average Wallet Volume</span>
                            <span className="font-mono font-semibold text-white">$500</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/20 pb-2">
                            <span>7d Price Change</span>
                            <span className="font-mono font-semibold text-green-400">+3.45%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Latest News</span>
                            <span className="italic text-primary-light">
                                New partnership announced
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
            <ShootingStars />
            <StarsBackground />
        </div>
    )
}
