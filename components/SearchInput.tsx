"use client"

import { motion } from "motion/react"
import { LayoutTextFlip } from "./ui/layout-text-flip"
import { Input } from "./ui/input"

const words = ["Gem", "Sleeper", "Hidden Pick", "Underdog"]

export function SearchInput() {
    const handleChange = () => {}
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="h-[15rem] flex flex-col justify-center items-center px-4 w-full">
            <div className="mb-8">
                <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row ">
                    <LayoutTextFlip text="Search for the Next " words={words} />
                </motion.div>
            </div>

            <Input onChange={handleChange} onSubmit={onSubmit} />
        </div>
    )
}
