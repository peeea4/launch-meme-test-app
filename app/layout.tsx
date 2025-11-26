import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

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
                    <footer className="h-[100px] w-full flex justify-center">
                        <div className="max-w-7xl w-full">Footer</div>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    )
}
