"use client"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { HeroHighlight } from "./hero-highlight"

export function HeroBackground({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <HeroHighlight className="min-h-screen">
            <motion.main
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className={cn(className, "min-h-screen")}
            >
                {children}
            </motion.main>
        </HeroHighlight>
    )
}
