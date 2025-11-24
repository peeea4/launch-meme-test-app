"use client"
import { TokenItemDataType } from "@/types/token"
import { BackgroundGradient } from "./ui/background-gradient"
import { useEffect, useState } from "react"

type HeroTokenCardProps = {
    tokenData: TokenItemDataType
}

export const HeroTokenCard = ({ tokenData }: HeroTokenCardProps) => {
    const { name, symbol, photo, description, priceUsd, volumeUsd, holders, progress, tokenType } =
        tokenData

    const [priceUp, setPriceUp] = useState(true)
    const [volumeUp, setVolumeUp] = useState(true)
    const [holdersUp, setHoldersUp] = useState(true)

    useEffect(() => {
        setPriceUp(Math.random() > 0.5)
        setVolumeUp(Math.random() > 0.5)
        setHoldersUp(Math.random() > 0.5)
    }, [])

    const formatPriceWithSmallZeros = (num?: number) => {
        if (!num) return "$0.00"
        const str = num.toString()
        const match = str.match(/^0\.0*(\d+)/)
        if (!match) return `$${num}`
        const zerosCount = (str.match(/^0\.0*/)?.[0].length ?? 2) - 2
        const significantPart = match[1]
        return (
            <>
                $0.
                {zerosCount > 0 && (
                    <span className="align-bottom text-[0.65em] ml-[0.05em]">{zerosCount}</span>
                )}
                {significantPart}
            </>
        )
    }

    const formatCurrency = (num?: number) => {
        if (!num) return "$0.00"
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        }).format(num)
    }

    return (
        <BackgroundGradient className="relative flex flex-col items-center border-[2.5px] overflow-hidden shadow-2xl bg-linear-to-br from-zinc-900 via-black to-zinc-800 rounded-[22px] p-4 h-full">
            {/* Строка 1: Картинка + Название + Теги */}
            <div className="flex w-full items-start mb-2">
                <img
                    src={photo || ""}
                    alt={name}
                    className="object-cover h-[56px] w-[56px] rounded-xl border-2 border-white/20 shadow-lg"
                />
                <div className="flex flex-col ml-4 flex-1">
                    <span className="text-lg font-extrabold text-white drop-shadow-xl">
                        {name}
                        <span className="text-zinc-400 font-bold ml-2">({symbol})</span>
                    </span>
                    <div className="flex gap-1 mt-1">
                        {tokenType && (
                            <span className="bg-zinc-800 text-zinc-100 text-xs rounded px-2 py-1 border border-zinc-700 font-semibold">
                                {tokenType}
                            </span>
                        )}
                        <span className="bg-zinc-800 bg-opacity-70 text-xs rounded px-2 py-1 font-semibold text-white shadow">
                            Holders: {holders ?? 0}
                        </span>
                        <span className="bg-zinc-800 bg-opacity-70 text-xs rounded px-2 py-1 font-semibold text-white shadow">
                            {volumeUp ? "Vol ↑" : "Vol ↓"}: {formatCurrency(volumeUsd)}
                        </span>
                    </div>
                </div>
            </div>
            {/* Строка 2: Описание */}
            {description && (
                <p className="text-left text-zinc-300/80 mt-2 text-center drop-shadow-sm mb-2 w-full line-clamp-3">
                    {description}
                </p>
            )}
            {/* Строка 3: Прогресс */}
            <div className="w-full mt-2 mb-2">
                <div className="flex items-center justify-between mb-1">
                    <span
                        className={
                            priceUp
                                ? "text-green-400 font-bold text-[1.07em]"
                                : "text-red-400 font-bold text-[1.07em]"
                        }
                    >
                        {formatPriceWithSmallZeros(priceUsd)} {priceUp ? "▲" : "▼"}
                    </span>
                </div>
            </div>
            <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <span> View Details</span>
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
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </button>
        </BackgroundGradient>
    )
}
