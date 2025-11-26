import { cn } from "@/lib/utils"

import { Coins } from "lucide-react"
import { SparklesCore } from "./ui/sparkles"

export const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2.5 relative py-3", className)}>
            <div className="w-full absolute inset-0">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.8}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div>
            <Coins height={32} width={32} />
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white relative z-20">
                launch.meme
            </h1>
        </div>
    )
}
