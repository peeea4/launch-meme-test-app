import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from "./Logo"
import Link from "next/link"

type NavigationItem = {
    title: string
    href: string
}[]

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
    return (
        <header className="bg-background sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-4 sm:px-6">
                <div className="text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16">
                    <Link href="/">Home</Link>
                    <Link href="/tokens" className="hover:text-primary max-md:hidden">
                        Tokens
                    </Link>
                    <Link href="/">
                        <Logo className="text-foreground gap-3" />
                    </Link>
                    <a href="#" className="hover:text-primary max-md:hidden">
                        Fake
                    </a>
                    <a href="#" className="hover:text-primary max-md:hidden">
                        Fake
                    </a>
                </div>

                <div className="flex items-center gap-6">
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
