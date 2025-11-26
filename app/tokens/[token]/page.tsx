import { TokenDetailsPageClient } from "@/components/TokenDetailsPage"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

export default async function TokenDetailsPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params

    return (
        <div className="max-w-7xl mx-auto w-full">
            <TokenDetailsPageClient tokenAddress={token} />
            <ShootingStars />
            <StarsBackground />
        </div>
    )
}
