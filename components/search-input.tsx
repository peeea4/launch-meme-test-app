"use client"

import { FlipWords } from "./ui/flip-words"
import { LayoutTextFlip } from "./ui/layout-text-flip"
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input"
import { motion } from "motion/react"

const words = ["Gem", "Sleeper", "Hidden Pick", "Underdog"]

export function PlaceholdersAndVanishInputDemo() {
    const placeholders = ["Dogecoin", "Shiba Inu", "MemeCore", "Pepe", "Toshi"]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
    }
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submitted")
    }

    return (
        <div className="h-[15rem] flex flex-col justify-center items-center px-4 w-full">
            <div className="mb-8">
                <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row ">
                    <LayoutTextFlip text="Search for the Next " words={words} />
                </motion.div>
            </div>

            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
            />
        </div>
    )
}
