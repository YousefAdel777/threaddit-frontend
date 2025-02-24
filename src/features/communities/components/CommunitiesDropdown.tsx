"use client"

import { FaPlusCircle, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import useSWR from "swr";
import getUserCommunities from "@/lib/getUserCommunities";
import Community from "./Community";

export default function CommunitiesDropdown({ showModal }: { showModal: () => void }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: communities } = useSWR('/api/user/communities', getUserCommunities);
    
    return (
        <div className="py-2">
            <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center justify-between hover:bg-secondary duration-100 cursor-pointer px-4 py-3 rounded-md">
                <span className="uppercase text-xs tracking-wider">
                    Communities
                </span>
                <span className={`${showDropdown ? "rotate-180" : "rotate-0"} duration-200`}>
                    <FaChevronDown />
                </span>
            </div>
            <div className={`${showDropdown ? "max-h-svh overflow-y-auto" : "max-h-0"} overflow-hidden duration-300 bg-white rounded-b-md`}>
                <div className="py-3 flex items-center gap-2 hover:bg-secondary cursor-pointer px-4" onClick={showModal}>
                    <FaPlusCircle className="text-xl text-primary" />
                    <span className="text-sm">Create a community</span>
                </div>
                {communities?.map((community: Community) => (
                    <Community key={community.id} {...community} />
                ))}
            </div>
        </div>
    )
}