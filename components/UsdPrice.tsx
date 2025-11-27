"use client"

type TinyNumberProps = {
    value?: number
    className?: string
}

export const TinyNumber = ({ value, className }: TinyNumberProps) => {
    if (value === undefined || value === null) return <span className={className}>0</span>

    const str = value.toString()

    if (!str.includes(".")) {
        return <span className={className}>{str}</span>
    }

    const [intPart, fracPart] = str.split(".")

    let zeroCount = 0
    for (let i = 0; i < fracPart.length; i++) {
        if (fracPart[i] === "0") zeroCount++
        else break
    }

    const rest = fracPart.slice(zeroCount)

    if (zeroCount <= 1) {
        return <span className={className}>{str}</span>
    }

    const trimmedRest = rest.slice(0, 4)

    return (
        <span className={className}>
            {intPart}. 0<sup className="text-[0.6em] align-bottom">{zeroCount - 1}</sup>
            {trimmedRest}
        </span>
    )
}
