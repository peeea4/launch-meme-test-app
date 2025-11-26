/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"

import { AnimatePresence, motion } from "motion/react"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { supportedByIcons } from "@/data/supported-by-icons"

const Icon = ({ className, ...rest }: any) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    )
}

const CustomCard = ({
    title,
    icon,
    children,
}: {
    title: string
    icon: React.ReactNode
    children?: React.ReactNode
}) => {
    const [hovered, setHovered] = React.useState(false)
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-xs w-full mx-auto p-4 relative h-30 relative"
        >
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full w-full absolute inset-0"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-20">
                <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full  mx-auto flex items-center justify-center">
                    {icon}
                </div>

                <h2 className="text-center hidden dark:text-white text-xl opacity-0 group-hover/canvas-card:block group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4 font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
                    {title}
                </h2>
            </div>
        </div>
    )
}

export function IconCards() {
    return (
        <div className="max-w-7xl flex gap-6 py-8 px-4 justify-center items-center">
            {supportedByIcons.map(({ icon, title, colors }, idx) => (
                <CustomCard key={idx} title={title} icon={icon}>
                    <CanvasRevealEffect
                        animationSpeed={3}
                        containerClassName="bg-background"
                        colors={colors}
                    />
                </CustomCard>
            ))}
        </div>
    )
}
