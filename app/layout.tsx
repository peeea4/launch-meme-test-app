import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

import Navbar from "@/components/NavBar/NavBar"
import CanvasCursor from "@/components/CanvasCursor"
import { HeroBackground } from "@/components/hero-background"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const navigationData = [
    {
        title: "Home",
        href: "/",
        // icon: Home,
    },
]

export const metadata: Metadata = {
    title: "launch.meme",
    description: "Launch Meme App Description",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HeroBackground>
                        <main>
                            {/* <CanvasCursor /> */}
                            <Navbar navigationData={navigationData} />
                            {children}
                        </main>
                    </HeroBackground>
                </ThemeProvider>
            </body>
        </html>
    )
}
