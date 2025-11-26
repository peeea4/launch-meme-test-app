"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

interface NavLinkProps {
    href: string
    children: React.ReactNode
    className?: string
}

export default function NavLink({ href, children, className }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href || (href === "/" && pathname === "/")

    return (
        <Link
            href={href}
            className={clsx("relative transition-colors", className)}
            aria-current={isActive ? "page" : undefined}
        >
            <div
                className={clsx(
                    "rounded-sm px-3 py-0.5",
                    isActive
                        ? "text-white rounded-sm bg-neutral-900/80 px-3 py-0.5 border"
                        : "px-3 py-0.5 border border-transparent hover:border-inherit hover:bg-neutral-900/60"
                )}
            >
                {children}
            </div>
        </Link>
    )
}
