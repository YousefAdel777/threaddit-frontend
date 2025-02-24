"use client"

import { useFormStatus } from "react-dom"

type Props = {
    className?: string
    disabled?: boolean
    onClick?: () => void
    children?: React.ReactNode
}

export default function Button({ className, disabled, onClick, children }: Props) {
    const { pending } = useFormStatus();
    return (
        <button 
            onClick={onClick} 
            disabled={disabled || pending} 
            className={`bg-primary text-white font-semibold rounded-3xl px-5 py-3 ${pending || disabled ? "opacity-50" : "hover:bg-primary-hover"} duration-100 ${className || ""}`}
        >
            {children}
        </button>
    )
}