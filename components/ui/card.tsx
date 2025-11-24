import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm isolate aspect-video w-96 bg-background/20  ring-1 ring-black/5",
                className
            )}
            {...props}
        />
    )
}

export { Card }
