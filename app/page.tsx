import HeroSection from "@/components/Hero"

import { CarouselSpacing } from "@/components/TokensCarousel"

export default function Home() {
    return (
        <main>
            <HeroSection />
            <div className="flex justify-center">
                <div className="flex flex-col justify-start max-w-7xl pt-20">
                    <CarouselSpacing />
                </div>
            </div>
        </main>
    )
}
