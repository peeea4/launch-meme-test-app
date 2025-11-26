"use client"

import { IconCards } from "./ui/icon-cards"
import { WavyBackground } from "./ui/wavy-background"

const HeroSection = () => {
    return (
        <WavyBackground className="pt-20 max-w-xs sm:max-w-3xl md:max-w-5xl lg:max-w-7xl">
            <p className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl text-white font-bold inter-var text-center">
                Hunt meme gems like an alpha — not a gambler.
            </p>
            <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                Our platform turns chaotic meme hunting into a clear, community-powered discovery
                engine.
            </p>
            <div className="mt-30 hidden md:block lg:block">
                <p className="text-base text-muted-foreground text-center">Supported by</p>
                <IconCards />
            </div>
        </WavyBackground>
    )
}

export default HeroSection
