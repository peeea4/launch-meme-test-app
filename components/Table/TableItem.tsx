"use client"
import { TokenItemDataType } from "@/types/token"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react"
import { useTokensStore } from "@/store/tokens-store"

import { TableCell, TableRow } from "../ui/table"
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
}

const TableItem: FC<TableItemProps> = memo(
    ({ tokenData }) => {
        const { name, symbol, token, metadataUri, holders, marketCapUsd, volumeUsd, progress } =
            tokenData
        const [photo, setPhoto] = useState<string | null>(null)
        const [imageError, setImageError] = useState(false)
        const getImage = useTokensStore((state) => state.getImage)

        useEffect(() => {
            if (!metadataUri || !token) return

            getImage(metadataUri, token).then((imageUrl) => {
                setPhoto(imageUrl)
                setImageError(false)
            })
        }, [metadataUri, token, getImage])

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

        return (
            <TableRow
                className="has-data-[state=checked]:bg-muted/50 cursor-pointer"
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
                    <span className="inline-block min-w-[100px] text-right">{volumeFormatted}</span>
                </TableCell>
                <TableCell className="font-mono tabular-nums text-right whitespace-nowrap">
                    <span className="inline-block min-w-[120px] text-right">
                        {marketCapFormatted}
                    </span>
                </TableCell>

                <TableCell>
                    <div className="bg-card rounded-full h-2 w-full overflow-hidden min-w-[150px]">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </TableCell>

                <TableCell className="text-right font-mono tabular-nums whitespace-nowrap">
                    <span className="inline-block min-w-[80px] text-right">{holders}</span>
                </TableCell>
            </TableRow>
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
