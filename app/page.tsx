import { TokensList } from "@/components/TokensList"

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background font-sans p-8">
            <TokensList />
        </div>
    )
}
