import { TokenDetailsPageClient } from "@/components/TokenDetailsPage"

export default async function TokenDetailsPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params

    return (
        <div className="flex min-h-screen flex-col bg-background font-sans p-8">
            <div className="max-w-6xl mx-auto w-full">
                <TokenDetailsPageClient tokenAddress={token} />
            </div>
        </div>
    )
}
