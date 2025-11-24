import HeroSection from "@/components/Hero"
import { HeroTokenCard } from "@/components/HeroTokenCard"
import { favorites } from "@/data/favorites"

export default function Home() {
    return (
        <div className="min-h-screen font-sans flex justify-center relative ">
            <main className="flex flex-col max-w-7xl">
                <HeroSection />
                {/* <div className="flex justify-center">
                    <GlowingEffectDemoSecond />
                </div> */}

                <div className="flex flex-col justify-start">
                    <p className="text-xl font-bold text-left text-white drop-shadow mt-10 mb-5 pl-3">
                        Featured Tokens
                    </p>
                    <div className="flex justify-center flex-wrap py-4">
                        {Object.values(favorites.tokens).map((tokenData) => (
                            <div key={tokenData.name} className="w-1/3">
                                <div className="p-3">
                                    <HeroTokenCard tokenData={tokenData} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
