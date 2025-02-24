import React from "react"
import Image from "next/image"
import Link from "next/link"

type Props = {
    id: number;
    name: string;
    icon: string | null,
}

export default function Community({ name, icon, id }: Props) {
    return (    
        <div className="py-0.5 duration-100 rounded-md hover:bg-secondary cursor-pointer px-1.5">
            <Link href={`/communities/${id}`} className="flex items-center gap-2">
                <Image className="rounded-full" src={icon ? icon : "/images/community_image.webp"} alt="Community Icon" width={40} height={40} />
                <p className="text-sm">
                    t/{name}
                </p>
            </Link>
        </div>
    )
}