"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import favorites from "@/data/favorites.json"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"
import { HeroTokenCard } from "./HeroTokenCard"

export function TokensCarousel() {
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

    return (
        <Carousel
            className="w-full max-w-7xl"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="-ml-1 gap-8 sm:gap-0 md:gap-0 lg:gap-0 xl:gap-0: 2xl:gap-0">
                {Object.values(favorites).map((tokenData) => (
                    <CarouselItem
                        key={tokenData.name}
                        className="pl-1 md:basis-1/2 lg:basis-1/2 xl:basis-1/3 2xl:basis-1/3 flex justify-center"
                    >
                        <HeroTokenCard tokenData={tokenData} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    )
}
