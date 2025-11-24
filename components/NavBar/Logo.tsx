import LogoSvg from "@/assets/svg/LogoSvg"
import { cn } from "@/lib/utils"
import { SparklesCore } from "../ui/sparkles"

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2.5 relative py-3", className)}>
            <LogoSvg className="size-8.5" />

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
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-white relative z-20">
                launch.meme
            </h1>

            <span className="text-xl font-semibold"></span>
        </div>
    )
}

export default Logo
