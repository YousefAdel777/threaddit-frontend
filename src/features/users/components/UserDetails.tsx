"use client"

import { createBlock, createFollow, deleteFollow } from "@/lib/actions";
import Button from "@/features/common/components/Button";
import { GoGear } from "react-icons/go";
import { BsCake2, BsPostcardHeart } from "react-icons/bs";
import { RiChatFollowUpLine, RiUserFollowLine } from "react-icons/ri";
import { formatDateShort } from "@/lib/utils";
import { useEffect, useState } from "react";
import UserSettingsModal from "./UserEditModal";
import { useChatsStore } from "@/stores/chatsStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
    id: number;
    bio: string;
    image: string | null;
    created_at: string;
    post_karma: number;
    comment_karma: number;
    username: string;
    follow_id: number | null;
    followers_count: number;
    is_current_user: boolean;
}

export default function UserDetails({ id, follow_id, followers_count, username, post_karma, comment_karma, created_at, is_current_user, image, bio }: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const { setUserId, setIsChatsOpen, setIsChatsExpanded } = useChatsStore();

    const handleBlock = async () => {
        await createBlock({ blocked_user: id });
    }

    const handleFollow = async () => {
        if (follow_id) {
            await deleteFollow(follow_id);
        }
        else {
            await createFollow({ followed: id });
        }
    } 

    const handleChat = () => {
        if (!session?.accessToken) {
            router.push("/signin");
        }
        setUserId(id);
        setIsChatsOpen(true);
        setIsChatsExpanded(true);
    }

    useEffect(() => {
        if (showSettings) {
            document.body.style.overflowY = "hidden";
        }
        else {
            document.body.style.overflowY = "visible";
        }
    }, [showSettings]);

    return (
        <>
            {
                showSettings &&
                <UserSettingsModal bio={bio} username={username} image={image} closeModal={() => setShowSettings(false)} />
            }
            <div className="sticky divide-y-[1px] divide-ternary w-1/3 bg-secondary top-24 right-2 rounded-xl">
                <div className="flex items-center justify-between p-3">
                    <h3 className="text-lg font-semibold">{username}</h3>
                    {
                        !is_current_user &&
                        <form 
                            action={handleBlock}>
                            <Button className="text-sm">
                                Block
                            </Button>
                        </form>
                    }
                    {
                        is_current_user &&
                        <button className="duration-200 flex items-center justify-center w-8 h-8 rounded-full hover:bg-ternary" onClick={() => setShowSettings(true)}>
                            <GoGear className="text-xl text-primary" />
                        </button>
                    }
                </div>
                {
                    !is_current_user &&
                    <div className="p-3 flex items-center gap-2">
                        <form action={handleFollow}>
                            <Button className="text-sm">
                                {follow_id ? "Unfollow" : "Follow"}
                            </Button>
                        </form>
                        <Button 
                            onClick={handleChat} 
                            className="text-sm" 
                        >
                            Chat
                        </Button>
                    </div>
                }
                <div className="p-3 space-y-4">
                    <div className="flex items-center gap-3">
                        <BsCake2 className="text-lg text-primary" />
                        <p className="text-sm">
                            Joined {formatDateShort(created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BsPostcardHeart className="text-lg text-primary" />
                        <p className="text-sm">
                            Post Karma: {post_karma}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RiChatFollowUpLine className="text-lg text-primary" />
                        <p className="text-sm">
                            Comment Karma: {comment_karma}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <RiUserFollowLine className="text-lg text-primary" />
                        <p className="text-sm">
                            Followers: {followers_count}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}