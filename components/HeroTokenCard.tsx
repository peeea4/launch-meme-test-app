/* eslint-disable react-hooks/purity */
"use client"
import { TokenItemDataType } from "@/types/token"
import { XLogoIcon } from "@phosphor-icons/react"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { FC } from "react"
import { Card } from "./ui/card"
import Link from "next/link"

type HeroTokenCardProps = {
    tokenData: TokenItemDataType
}

export const HeroTokenCard: FC<HeroTokenCardProps> = ({ tokenData }) => {
    const {
        name,
        symbol,
        photo,
        description,
        priceUsd,
        volumeUsd,
        holders,
        tokenType,
        x,
        website,
        token,
    } = tokenData

    const formatCurrency = (num?: number) => {
        if (!num) return "$0.00"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(num)
    }

    const openTokenDetailsPage = () => {
        window.open(`/tokens/${token}`, "_blank", "noopener,noreferrer")
    }

    return (
        <Card className="w-100 rounded-3xl p-10 bg-background h-full">
            <div className="flex w-full items-start">
                <Image
                    src={photo || ""}
                    alt={name}
                    width={56}
                    height={56}
                    className="object-cover h-14 w-14 rounded-xl border-2 border-white/20 shadow-lg"
                />
                <div className="flex flex-col ml-4 flex-1">
                    <span className="text-lg font-extrabold text-white drop-shadow-xl">{name}</span>
                    <span className="text-zinc-400 font-bold">{symbol}</span>
                </div>
            </div>
            {description && (
                <p className="text-left text-zinc-300/80 drop-shadow-sm mb-1 w-full line-clamp-3">
                    {description}
                </p>
            )}
            <div className="flex gap-2">
                {tokenType && (
                    <span className="bg-zinc-800 text-zinc-100 text-xs rounded px-2 py-1 border border-zinc-700 font-semibold">
                        {tokenType}
                    </span>
                )}
                <span className="bg-zinc-800 bg-opacity-70 text-xs rounded px-2 py-1 font-semibold text-white shadow">
                    Holders: {holders ?? 0}
                </span>
                <span className="bg-zinc-800 bg-opacity-70 text-xs rounded px-2 py-1 font-semibold text-white shadow">
                    Volume: {formatCurrency(volumeUsd)}
                </span>
            </div>
            <div className="flex flex-col items-center w-full mt-auto">
                <div className="w-full mt-2 mb-2">
                    <div className="flex items-center justify-between mb-1">
                        <span
                            className={
                                Math.random() > 0.5
                                    ? "text-green-400 font-bold text-[1.07em]"
                                    : "text-red-400 font-bold text-[1.07em]"
                            }
                        >
                            {priceUsd} {Math.random() > 0.5 ? "▲" : "▼"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between w-full">
                    <button
                        onClick={openTokenDetailsPage}
                        className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block"
                    >
                        <span className="absolute inset-0 overflow-hidden rounded-full">
                            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </span>
                        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                            <span>View Details</span>
                            <svg
                                fill="none"
                                height="16"
                                viewBox="0 0 24 24"
                                width="16"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.75 8.75L14.25 12L10.75 15.25"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                        <span className="absolute bottom-0 left-4.5 h-px w-[calc(100%-2.25rem)] bg-linear-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>
                    <div className="flex gap-2 items-center">
                        {x && (
                            <div className="cursor-pointer">
                                <Link href={x}>
                                    <XLogoIcon size={16} />
                                </Link>
                            </div>
                        )}
                        {website && (
                            <div className="cursor-pointer">
                                <Link href={website}>
                                    <ExternalLink size={16} />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
