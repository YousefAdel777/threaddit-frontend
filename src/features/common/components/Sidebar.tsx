"use client"

import { IoHomeOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineExplore } from "react-icons/md";
import CommunityModal from "@/features/communities/components/CreateCommunityModal";
import CommunitiesDropdown from "@/features/communities/components/CommunitiesDropdown";
import { useSession } from "next-auth/react";
import { useState } from "react";
import NavLink from "@/features/common/components/NavLink";
import { createPortal } from "react-dom";

export default function Sidebar() {
    const { data: session } = useSession();    
    const [showModal, setShowModal] = useState(false); 
    
    return (
        <>
            {
                showModal &&
                createPortal(
                    <CommunityModal closeModal={() => setShowModal(false)} />,
                    document.body
                )
            }
            <div className="min-h-[calc(100svh_-_5rem)] max-h-[calc(100svh_-_5rem)] overflow-y-auto divide-y-[1px] divide-secondary border-r-[1px] border-secondary bg-white w-64 px-4 py-3 fixed left-0 bottom-0">
                <div className="mb-4 space-y-2">
                    <NavLink className="px-4 flex rounded-md items-center gap-4 py-3 hover:bg-secondary duration-100" href="/">
                        <IoHomeOutline className="text-2xl text-primary" />
                        <span>Home</span>
                    </NavLink>
                    <NavLink className="px-4 flex rounded-md items-center gap-4 py-3 hover:bg-secondary duration-100" href="/popular">
                        <FaArrowTrendUp className="text-2xl text-primary"  />
                        <span>Popular</span>
                    </NavLink>
                    <NavLink className="px-4 flex rounded-md items-center gap-4 py-3 hover:bg-secondary duration-100" href="/explore">
                        <MdOutlineExplore className="text-2xl text-primary"  />
                        <span>Explore</span>
                    </NavLink>
                </div>
                {
                    session?.user &&
                    <CommunitiesDropdown showModal={() => setShowModal(true)} />
                }
            </div>
        </>
    )
}