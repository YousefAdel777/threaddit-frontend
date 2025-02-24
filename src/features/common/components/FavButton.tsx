"use client"

import { FaStar, FaRegStar } from "react-icons/fa";
import { useFormStatus } from "react-dom";

export default function FavButton({ is_favorite }: { is_favorite: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} className={`${pending ? "opacity-50" : ""} w-10 h-10 flex items-center justify-center rounded-full duration-200 hover:bg-secondary`}>
            {
                is_favorite ?
                <FaStar className="text-xl text-primary" />
                :
                <FaRegStar className="text-xl text-primary" />
            }
        </button>
    )
}