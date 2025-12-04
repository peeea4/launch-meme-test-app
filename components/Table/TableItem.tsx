"use client"
import { TokenItemDataType } from "@/types/token"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { useTokensStore } from "@/store/tokens-store"

import { TableCell } from "../ui/table"
import { CopyIconButton } from "../CopyIconButton"

function truncateMiddle(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    const separator = "..."
    const sepLen = separator.length
    const charsToShow = maxLength - sepLen
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return str.substring(0, frontChars) + separator + str.substring(str.length - backChars)
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
})

const formatCurrency = (num: number | undefined): string => {
    if (num === undefined || num === null) return "$0.00"
    return currencyFormatter.format(num)
}

type TableItemProps = {
    tokenData: TokenItemDataType
    index?: number
}

const TableItem: FC<TableItemProps> = memo(
    ({ tokenData, index = 0 }) => {
        const { name, symbol, token, metadataUri, holders, marketCapUsd, volumeUsd, progress } =
            tokenData
        const [photo, setPhoto] = useState<string | null>(null)
        const [imageError, setImageError] = useState(false)
        const [isNew, setIsNew] = useState(true)
        const [volumeDirection, setVolumeDirection] = useState<"up" | "down" | null>(null)
        const [marketCapDirection, setMarketCapDirection] = useState<"up" | "down" | null>(null)
        const [holdersDirection, setHoldersDirection] = useState<"up" | "down" | null>(null)
        const prevVolumeRef = useRef<number | undefined>(undefined)
        const prevMarketCapRef = useRef<number | undefined>(undefined)
        const prevHoldersRef = useRef<number | undefined>(undefined)
        const getImage = useTokensStore((state) => state.getImage)

        useEffect(() => {
            if (!metadataUri || !token) return

            getImage(metadataUri, token).then((imageUrl) => {
                setPhoto(imageUrl)
                setImageError(false)
            })
        }, [metadataUri, token, getImage])

        useEffect(() => {
            const delay = Math.min(index * 50, 300)
            const timer = setTimeout(() => {
                setIsNew(false)
            }, 500 + delay)
            return () => clearTimeout(timer)
        }, [index])

        useEffect(() => {
            if (volumeUsd === undefined) {
                prevVolumeRef.current = undefined
                return
            }

            if (prevVolumeRef.current !== undefined && prevVolumeRef.current !== volumeUsd) {
                const direction = volumeUsd > prevVolumeRef.current ? "up" : "down"
                setVolumeDirection(direction)
                const timer = setTimeout(() => setVolumeDirection(null), 2000)
                prevVolumeRef.current = volumeUsd
                return () => clearTimeout(timer)
            }

            prevVolumeRef.current = volumeUsd
        }, [volumeUsd])

        useEffect(() => {
            if (marketCapUsd === undefined) {
                prevMarketCapRef.current = undefined
                return
            }

            if (
                prevMarketCapRef.current !== undefined &&
                prevMarketCapRef.current !== marketCapUsd
            ) {
                const direction = marketCapUsd > prevMarketCapRef.current ? "up" : "down"
                setMarketCapDirection(direction)
                const timer = setTimeout(() => setMarketCapDirection(null), 2000)
                prevMarketCapRef.current = marketCapUsd
                return () => clearTimeout(timer)
            }

            prevMarketCapRef.current = marketCapUsd
        }, [marketCapUsd])

        useEffect(() => {
            if (holders === undefined) {
                prevHoldersRef.current = undefined
                return
            }

            if (prevHoldersRef.current !== undefined && prevHoldersRef.current !== holders) {
                const direction = holders > prevHoldersRef.current ? "up" : "down"
                setHoldersDirection(direction)
                const timer = setTimeout(() => setHoldersDirection(null), 2000)
                prevHoldersRef.current = holders
                return () => clearTimeout(timer)
            }

            prevHoldersRef.current = holders
        }, [holders])

        const openDetailedPage = useCallback(() => {
            window.open(`/tokens/${token}`, "_blank", "noopener,noreferrer")
        }, [token])

        const progressPercent = useMemo(
            () => (progress !== undefined ? (progress * 100).toFixed(2) : "0.00"),
            [progress]
        )

        const volumeFormatted = useMemo(() => formatCurrency(volumeUsd), [volumeUsd])
        const marketCapFormatted = useMemo(() => formatCurrency(marketCapUsd), [marketCapUsd])
        const tokenTruncated = useMemo(() => truncateMiddle(token, 20), [token])
        const creatorTruncated = useMemo(
            () => truncateMiddle(tokenData.creator, 15),
            [tokenData.creator]
        )
        const symbolFallback = useMemo(
            () => (symbol ? symbol.substring(0, 2).toUpperCase() : "?"),
            [symbol]
        )

        const renderDirectionIndicator = (direction: "up" | "down" | null, uniqueKey: string) => {
            return (
                <AnimatePresence mode="wait">
                    {direction === "up" ? (
                        <motion.div
                            key={`${uniqueKey}-up`}
                            initial={{ opacity: 0, scale: 0.5, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 5 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <ArrowUp className="w-3 h-3 text-green-500" />
                        </motion.div>
                    ) : direction === "down" ? (
                        <motion.div
                            key={`${uniqueKey}-down`}
                            initial={{ opacity: 0, scale: 0.5, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -5 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <ArrowDown className="w-3 h-3 text-red-500" />
                        </motion.div>
                    ) : (
                        <Minus
                            key={`${uniqueKey}-none`}
                            className="w-3 h-3 text-muted-foreground opacity-30"
                        />
                    )}
                </AnimatePresence>
            )
        }

        return (
            <motion.tr
                initial={{ opacity: 0, y: -10 }}
                animate={isNew ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.3),
                    ease: "easeOut",
                }}
                className="has-data-[state=checked]:bg-muted/50 cursor-pointer transition-colors"
                onClick={openDetailedPage}
            >
                <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-muted">
                            {photo && !imageError ? (
                                <AvatarImage
                                    src={photo}
                                    alt={name}
                                    className="w-full h-full object-contain"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <AvatarFallback className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium">
                                    {symbolFallback}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{name}</div>
                            <span className="text-muted-foreground mt-0.5 text-xs truncate block">
                                {symbol}
                            </span>
                        </div>
                    </div>
                </TableCell>

                <TableCell>
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="truncate">{tokenTruncated}</span>
                            <CopyIconButton textToCopy={token} />
                        </div>
                        <span className="text-xs text-muted-foreground truncate">
                            by {creatorTruncated}
                        </span>
                    </div>
                </TableCell>

                <TableCell className="font-mono tabular-nums text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <span className="inline-block min-w-[100px] text-right transition-all duration-300">
                            {volumeFormatted}
                        </span>
                        <div className="w-3 h-3 flex items-center justify-center">
                            {renderDirectionIndicator(volumeDirection, `volume-${volumeUsd}`)}
                        </div>
                    </div>
                </TableCell>
                <TableCell className="font-mono tabular-nums text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <span className="inline-block min-w-[120px] text-right transition-all duration-300">
                            {marketCapFormatted}
                        </span>
                        <div className="w-3 h-3 flex items-center justify-center">
                            {renderDirectionIndicator(
                                marketCapDirection,
                                `marketcap-${marketCapUsd}`
                            )}
                        </div>
                    </div>
                </TableCell>

                <TableCell>
                    <div className="bg-card rounded-full h-2 w-full overflow-hidden min-w-[150px]">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </TableCell>

                <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                        <span className="inline-block min-w-[80px] text-right transition-all duration-300">
                            {holders}
                        </span>
                        <div className="w-3 h-3 flex items-center justify-center">
                            {renderDirectionIndicator(holdersDirection, `holders-${holders}`)}
                        </div>
                    </div>
                </TableCell>
            </motion.tr>
        )
    },
    (prevProps, nextProps) => {
        const prev = prevProps.tokenData
        const next = nextProps.tokenData

        return (
            prev.token === next.token &&
            prev.volumeUsd === next.volumeUsd &&
            prev.marketCapUsd === next.marketCapUsd &&
            prev.holders === next.holders &&
            prev.progress === next.progress &&
            prev.name === next.name &&
            prev.symbol === next.symbol &&
            prev.metadataUri === next.metadataUri
        )
    }
)

TableItem.displayName = "TableItem"

export default TableItem
