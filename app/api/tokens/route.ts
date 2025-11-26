import { NextRequest, NextResponse } from "next/server"

const EXTERNAL_API_URL = "https://launch.meme/api/tokens"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { id } = body

        if (!id) {
            return NextResponse.json({ error: "Token ID is required" }, { status: 400 })
        }

        const response = await fetch(EXTERNAL_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: `External API error: ${response.status}` },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error proxying token request:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
