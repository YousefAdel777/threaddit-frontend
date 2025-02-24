"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
    href: string;
    children?: React.ReactNode;
    className?: string;
    isActive?: boolean
};

export default function NavLink({ href, className, children, isActive }: Props) {
    const pathname = usePathname(); 

    return (
        <Link
            href={href}
            className={`${isActive || pathname === href ? "active" : ""} ${className || ""}`}
        >
            {children}
        </Link>
    )
}