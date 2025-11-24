"use client"

import React from "react"

export function PlaceholdersAndVanishInput({
    placeholder = "Search tokens...",
    onChange,
    onSubmit,
}: {
    placeholder?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) {
    return (
        <form onSubmit={onSubmit} className="w-full flex justify-center">
            <input
                type="text"
                onChange={onChange}
                placeholder={placeholder}
                className="
          w-full max-w-lg rounded-xl px-4 py-3 
          text-lg bg-white dark:bg-neutral-900 
          border border-neutral-300 dark:border-neutral-700 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 
          transition
        "
            />
        </form>
    )
}
