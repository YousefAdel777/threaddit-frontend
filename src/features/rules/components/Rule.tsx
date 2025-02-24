"use client"
import { formatDateShort } from "@/lib/utils";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type Props = {
    title: string;
    description: string;
    created_at: string;
}

export default function Rule({ title, description, created_at }: Props) {
    const [showRule, setShowRule] = useState(false);
    return (
        <div>
            <div 
                onClick={() => {
                    setShowRule(!showRule);
                }} 
                className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-ternary duration-200 my-1 rounded-lg"
            >
                <p>
                    {title}
                </p>
                <BiChevronDown className={`text-xl text-gray-500 duration-200 ${showRule ? "rotate-180" : ""}`} />
            </div>
            {
                <div className={`${showRule ? "max-h-40" : "max-h-0"} px-3 duration-300 overflow-hidden`}>
                    <p className="text-sm">
                        {description}
                    </p>
                    <p className="text-xs mt-2">
                        Created {formatDateShort(created_at)}
                    </p>
                </div>
            }
        </div>
    )
} 