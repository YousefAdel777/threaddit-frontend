import { formatDateShort } from "@/lib/utils";
import Link from "next/link";
import Button from "@/features/common/components/Button";
import { useEffect, useState } from "react";
import BanModal from "@/features/ban/components/BanModal";
import { KeyedMutator } from "swr";
import UserAvatar from "@/features/users/components/UserAvatar";
import { deleteBanMutation, deleteBanOptions, updateMemberMutation, updateMemberOptions } from "@/lib/mutations";

type Props = {
    id: number;
    communityId: number;
    currentMember: Member;
    user: User;
    joined_at: string;
    members: Member[];
    ban: Ban | null;
    is_moderator: boolean;
    mutate: KeyedMutator<Member[]>;
}

export default function Member({ id, user, communityId, members, is_moderator, ban, joined_at, currentMember, mutate }: Props) {
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const handleUnban = async () => {
        if (ban) {
            await mutate(
                deleteBanMutation(ban.id, members),
                deleteBanOptions(ban.id, members)
            );
        }
    }

    const addModerator = async () => {
        await mutate(
            updateMemberMutation(id, { is_moderator: true }, members),
            updateMemberOptions(id, { is_moderator: true }, members)
        );
    }

    const removeModerator = async () => {
        await mutate(
            updateMemberMutation(id, { is_moderator: false }, members),
            updateMemberOptions(id, { is_moderator: false }, members)
        );
    }

    useEffect(() => {
        if (isBanModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [isBanModalOpen]);

    return (
        <div className="p-2" >
            {
                isBanModalOpen &&
                <BanModal members={members} mutate={mutate} communityId={communityId} closeModal={() => setIsBanModalOpen(false)} user={user} joined_at={joined_at} />
            }
            <div className="flex duration-200 items-center gap-4 rounded-xl p-3 hover:bg-secondary">
                <div>
                    <Link href={`/users/${user.id}/posts`}>
                        <UserAvatar size={70} image={user.image} username={user.username} />
                    </Link>
                </div>
                <div className="space-y-2 flex-1">
                    <Link className="text-lg hover:underline font-medium" href={`/users/${user.id}/posts`}>
                        u/{user.username}
                    </Link>
                    <div className="text-xs flex-1 space-y-1">
                        <p>
                            Post Karma: {user.post_karma}
                        </p>
                        <p>
                            Comment Karma: {user.comment_karma}
                        </p>
                        <p>
                            Joined: {formatDateShort(joined_at)}
                        </p>
                    </div>
                </div>
                {
                    !user.is_current_user &&
                    <div className="flex items-center gap-3">
                    {
                        currentMember.is_creator && !ban &&
                        <Button onClick={is_moderator ? removeModerator : addModerator}>
                            {is_moderator ? "Remove moderator" : "Make moderator"}
                        </Button>
                    }
                    {
                        !is_moderator &&
                        <div>
                            {
                                !ban?.is_active ?
                                <Button onClick={() => setIsBanModalOpen(true)}>
                                    Ban
                                </Button>
                                :
                                <Button onClick={handleUnban}>
                                    Unban
                                </Button>
                            }
                        </div>
                    }
                </div>
                }
            </div>  
        </div>
    )
}