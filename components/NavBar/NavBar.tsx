"use client"
import { easeInOut, motion } from "motion/react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Logo from "./Logo"
import NavLink from "./NavLink"
import Link from "next/link"

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
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/tokens">
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
                    <NavLink href="/career">Career</NavLink>
                    <NavLink href="/contacts">Contacts</NavLink>
                </div>

                <div className="flex font-medium text-muted-foreground">
                    <NavLink href="/profile">Profile</NavLink>
                    <NavLink href="/create-meme">Create Meme</NavLink>
                </div>

                <div className="sm:hidden flex items-center gap-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="md:hidden" asChild>
                            <Button variant="outline" size="icon">
                                <MenuIcon />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuGroup>
                                {navigationData.map((item, index) => (
                                    <DropdownMenuItem key={index}>
                                        <a href={item.href}>{item.title}</a>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Navbar
