"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import favorites from "@/data/favorites.json"
import { HeroTokenCard } from "./HeroTokenCard"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export function CarouselSpacing() {
    const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

    return (
        <Carousel
            className="w-full max-w-7xl"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="-ml-1">
                {Object.values(favorites).map((tokenData) => (
                    <CarouselItem
                        key={tokenData.name}
                        className="pl-1 basis-1/3 flex justify-center"
                    >
                        <HeroTokenCard tokenData={tokenData} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
