import HeroSection from "@/components/Hero"

import { TokensCarousel } from "@/components/TokensCarousel"
import ColourfulText from "@/components/ui/colourful-text"

export default function Home() {
    return (
        <main>
            <HeroSection />
            <div className="flex flex-col items-center">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-center text-white relative z-2 font-sans pt-20 pb-10 w-full w-max-2xl">
                    The best <ColourfulText text="tokens" /> you will ever find
                </h1>
                <div className="flex flex-col justify-start max-w-xs md:max-w-4xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                    <TokensCarousel />
                </div>
            </div>
        </main>
    )
}
