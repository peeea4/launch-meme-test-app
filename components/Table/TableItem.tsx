"use client"
import { TokenItemDataType } from "@/types/token"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { FC, useEffect, useState } from "react"

import { useRouter } from "next/navigation"
import { TableCell, TableRow } from "../ui/table"

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

const TableItem: FC<{ tokenData: TokenItemDataType }> = ({ tokenData }) => {
    const { name, symbol, token, metadataUri, holders, marketCapUsd, volumeUsd, progress } =
        tokenData
    const router = useRouter()
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
            .catch((err) => console.log("Failed to fetch metadata:", err))
    }, [metadataUri])

    const formatCurrency = (num: number | undefined) => {
        if (num === undefined || num === null) return "$0.00"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(num)
    }

    const openDetailedPage = () => {
        router.push(`/tokens/${token}`)
    }

    const progressPercent = progress !== undefined ? (progress * 100).toFixed(2) : "0.00"

    return (
        <TableRow
            className="has-data-[state=checked]:bg-muted/50 cursor-pointer"
            onClick={openDetailedPage}
        >
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                        {photo && (
                            <AvatarImage
                                src={photo}
                                alt={name}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </Avatar>
                    <div>
                        <div className="font-medium">{name}</div>
                        <span className="text-muted-foreground mt-0.5 text-xs">{symbol}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>{holders}</TableCell>
            <TableCell>{formatCurrency(volumeUsd)}</TableCell>
            <TableCell>{formatCurrency(marketCapUsd)}</TableCell>

            <TableCell>
                <div className="bg-card rounded-full h-2 w-full overflow-hidden">
                    <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </TableCell>

            <TableCell>{holders}</TableCell>
        </TableRow>
    )
}

export default TableItem
