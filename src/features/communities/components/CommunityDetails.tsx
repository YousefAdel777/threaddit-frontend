"use client";

import { formatDateShort } from "@/lib/utils";
import { BsCake2 } from "react-icons/bs";
import Rule from "@/features/rules/components/Rule";
import OnlineMembersCount from "./OnlineMembersCount";
import Moderator from "./Moderator";
import { useEffect, useState } from "react";
import EditCommunityModal from "./EditCommunityModal";
import IconButton from "@/features/common/components/IconButton";
import { GoGear } from "react-icons/go";

type Props = {
    community: Community;
    is_moderator: boolean;
}

const CommunityDetails = ({ community, is_moderator }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [isModalOpen]);

    return (
        <div className="sticky z-50 flex-1 divide-y-[1px] divide-y-ternary top-20 right-2 bg-secondary rounded-xl max-h-svh overflow-y-auto">
            {
                isModalOpen &&
                <EditCommunityModal community={community} closeModal={() => setIsModalOpen(false)} />
            }
            <div className="p-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">t/{community.name}</h2>
                    {
                        is_moderator &&
                        <IconButton className="text-primary hover:bg-ternary" onClick={() => setIsModalOpen(true)}>
                            <GoGear />
                        </IconButton>
                    }
                </div>
                <p className="text-sm mb-2">
                    {community.description}
                </p>
                <div className="flex mb-2 items-center gap-2">
                    <BsCake2 className="text-xl text-primary" />
                    <span className="text-sm">Created {formatDateShort(community.created_at)}</span>
                </div>
                <div className="flex mb-3 items-center gap-3">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold">
                            {community.members_count}
                        </h3>
                        <p className="text-sm">Members</p>
                    </div>
                    <div className="space-y-1">
                        <OnlineMembersCount communityId={community.id} />
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <p className="text-sm">
                                Online
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <h3 className="font-semibold">Rules</h3>
                {
                    community.rules?.map(rule => {
                        return (
                            <Rule key={rule.id} {...rule} />
                        )
                    })
                }
            </div>
            <div className="p-3">
                <h3 className="font-semibold mb-2">Moderators</h3>
                <div className="space-y-1">
                    {
                        community?.moderators.map(moderator => {
                            return (
                                <Moderator 
                                    key={moderator.id} 
                                    {...moderator.user}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CommunityDetails;