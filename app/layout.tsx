import { ThemeProvider } from "@/components/ThemeProvider"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import { Footer } from "@/components/Footer"
import Navbar from "@/components/NavBar/NavBar"

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
    },
    {
        title: "Tokens",
        href: "/tokens",
    },
    {
        title: "Career",
        href: "/career",
    },
    {
        title: "Contacts",
        href: "/contacts",
    },
    {
        title: "Profile",
        href: "/profile",
    },
    {
        title: "Create Meme",
        href: "/create-meme",
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
                    <Navbar navigationData={navigationData} />
                    {children}
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    )
}
