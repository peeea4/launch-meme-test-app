"use client"
import { easeInOut, motion } from "motion/react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

import NavLink from "./NavLink"
import Link from "next/link"
import { Logo } from "../Logo"

type NavigationItem = {
    title: string
    href: string
}[]

const pulseAnimation = {
    animate: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.7, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: easeInOut,
        },
    },
    whileHover: {
        scale: 1.2,
        transition: { duration: 0.3 },
    },
}

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
    return (
        <header className="bg-background/60 sticky top-0 z-50 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4 sm:px-6">
                <div className="flex flex-1 items-center gap-8 font-medium text-muted-foreground">
                    <Link href="/">
                        <Logo className="text-foreground gap-3" />
                    </Link>
                    <NavLink href="/" className="hidden lg:flex">
                        Home
                    </NavLink>
                    <NavLink href="/tokens" className="hidden lg:flex">
                        Tokens
                        <div className="absolute top-[-10] right-[-20]">
                            <motion.div className="ml-1" {...pulseAnimation}>
                                <Badge
                                    variant="default"
                                    className="text-xs capitalize bg-red-500/15 text-red-500 border border-red-500/30 rotate-12"
                                >
                                    live
                                </Badge>
                            </motion.div>
                        </div>
                    </NavLink>
                    <NavLink href="/career" className="hidden lg:flex">
                        Career
                    </NavLink>
                    <NavLink href="/contacts" className="hidden lg:flex">
                        Contacts
                    </NavLink>
                </div>

                <div className="hidden lg:flex font-medium text-muted-foreground items-center">
                    <NavLink href="/profile">Profile</NavLink>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Link href="/create-meme">
                            <motion.div
                                whileHover={{
                                    scale: 1.06,
                                    rotate: 1,
                                    boxShadow: "0 0 12px oklch(0.541 0.281 293.009)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-linear-to-r from-primary/20 to-primary text-white shadow-md"
                            >
                                Create Meme
                                <span className="absolute inset-0 bg-white/20 rounded-xl blur-sm opacity-0 hover:opacity-40 transition-opacity" />
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>

                <div className="lg:hidden flex items-center gap-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="lg:hidden" asChild>
                            <Button variant="outline" size="icon">
                                <MenuIcon />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            {navigationData.map((item, index) => (
                                <DropdownMenuItem key={index}>
                                    <a href={item.href}>{item.title}</a>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Navbar
