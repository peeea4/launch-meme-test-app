import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useState } from "react"

export const CopyIconButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
        })
    }

    return (
        <button
            onClick={handleCopy}
            aria-label="Copy address"
            className="p-1 text-muted-foreground hover:text-primary transition"
        >
            {copied ? (
                <CheckIcon className="w-3 h-3 text-primary" />
            ) : (
                <div className="cursor-pointer">
                    <ClipboardIcon className="w-3 h-3" />
                </div>
            )}
        </button>
    )
}
