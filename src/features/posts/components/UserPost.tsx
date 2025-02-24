"use client"

import Link from "next/link";
import { KeyedMutator } from "swr";
import PostContent from "./PostContent";
import InteractionButtons from "@/features/common/components/InteractionButtons";
import { addPostInteractionMutation, addPostInteractionOptions, deleteInteractionMutation, deleteInteractionOptions, updatePostInteractionMutation, updatePostInteractionOptions } from "@/lib/mutations";
import CommentsButton from "../../common/components/CommentsButton";
import CopyButton from "../../common/components/CopyButton";
import { RiShareLine } from "react-icons/ri";
import { FiCopy } from "react-icons/fi";
import ModeratorPostMenu from "./ModeratorPostMenu";
import PostReportForm from "./PostReportForm";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import PostMenu from "./PostMenu";
import CrossPostModal from "./CrossPostModal";
import { useRouter } from "next/navigation";
import UserAvatar from "../../users/components/UserAvatar";
import CommunityAvatar from "../../communities/components/CommunityAvatar";
import { createPortal } from "react-dom";
import { InfiniteKeyedMutator } from "swr/infinite";

type Props<T> = {
    type: PostType;
    status: PostStatus;
    content?: string;
    title: string;
    link?: string;
    original_post: Post | null;
    user: User;
    created_at: string;
    id: number;
    saved_post_id: number | null;
    attachments?: Attachment[];
    interaction: PostInteraction | null;
    interaction_diff: number;
    comments_count: number;
    is_author: boolean;
    community: Community | null;
    mutate: KeyedMutator<T> | InfiniteKeyedMutator<T>;
    data: T;
    is_reported: boolean;
    is_nsfw: boolean;
    is_spoiler: boolean;
}

export default function UserPost<T extends Post | Post[][]>({ type, content, title, link, original_post, user, created_at, id, saved_post_id, attachments, interaction, interaction_diff, comments_count, is_author, community, data, mutate, status, is_reported, is_spoiler, is_nsfw }: Props<T>) {
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [isCrosspostFormOpen, setIsCrosspostFormOpen] = useState(false);
    const router = useRouter();
    
    const handleUpvote = async () => {
        if (interaction?.interaction_type === "upvote") {
            await mutate(
                deleteInteractionMutation(interaction.id, data), 
                deleteInteractionOptions(interaction.id, data)
            );
        }
        else if (interaction?.interaction_type === "downvote") {
            await mutate(
                updatePostInteractionMutation(interaction.id, { interaction_type: "upvote" }, data),
                updatePostInteractionOptions(interaction.id, { interaction_type: "upvote" }, data)
            );
        }
        else {
            await mutate( 
                addPostInteractionMutation({ interaction_type: "upvote", post: id }, data), 
                addPostInteractionOptions({ interaction_type: "upvote", post: id }, data)
            );
        }
    }

    const handleDownvote = async () => {
        if (interaction?.interaction_type === "downvote") {
            await mutate(
                deleteInteractionMutation(interaction.id, data), 
                deleteInteractionOptions(interaction.id, data)
            );
        }
        else if (interaction?.interaction_type === "upvote") {
            await mutate(
                updatePostInteractionMutation(interaction.id, { interaction_type: "downvote" }, data),
                updatePostInteractionOptions(interaction.id, { interaction_type: "downvote" }, data)
            );
        }
        else {
            await mutate(
                addPostInteractionMutation({ interaction_type: "downvote", post: id }, data), 
                addPostInteractionOptions({ interaction_type: "downvote", post: id }, data)
            );
        }
    }

    useEffect(() => {
        if (isReportFormOpen || isCrosspostFormOpen) {
            document.body.classList.add("overflow-y-hidden");
        }
        else {
            document.body.classList.remove("overflow-y-hidden");
        } 
    }, [isReportFormOpen, isCrosspostFormOpen]);

    return (
        <div className="p-2 bg-white border-y-[1px] border-secondary">
            {
                (isReportFormOpen && community) &&
                <PostReportForm mutate={mutate} data={data} closeModal={() => setIsReportFormOpen(false)} postId={id} communityId={community?.id} />
            }
            {
                isCrosspostFormOpen &&
                createPortal(
                    <CrossPostModal closeModal={() => setIsCrosspostFormOpen(false)} postId={id} />,
                    document.body
                )
            }
            <div onClick={() => router.push(`/posts/${id}`)} className="hover:bg-secondary cursor-pointer block duration-100 py-2 px-4 rounded-lg">
                <div className="hover:bg-secondary block duration-100 py-2 rounded-lg">
                    <div className="flex items-center gap-3">
                        {
                            community ?
                            <div className="flex items-center gap-2">
                                <Link onClick={e => e.stopPropagation()} href={`/communities/${community.id}`}>
                                    <CommunityAvatar name={community.name} icon={community.icon} size={30} />
                                </Link>
                                <div>
                                    <Link onClick={e => e.stopPropagation()} href={`/communities/${community.id}`}>
                                        <p className="text-sm font-semibold">t/{community.name}</p>
                                    </Link>
                                    <Link onClick={e => e.stopPropagation()} href={`/users/${user.id}`}>
                                        <p className="text-xs font-medium">u/{user.username}</p>
                                    </Link>
                                </div>
                            </div>
                            :
                            <Link onClick={e => e.stopPropagation()} className="flex items-center gap-2" href={`/users/${user.id}`}>
                                <UserAvatar username={user.username} image={user.image} size={30} />
                                <p className="text-sm font-medium">u/{user.username}</p>
                            </Link>
                        }
                        <span className="text-xs">
                            {formatDate(created_at)}
                        </span>
                        <div className="ml-auto">
                            <PostMenu
                                id={id}
                                saved_post_id={saved_post_id}
                                data={data}
                                mutate={mutate}
                                is_author={is_author}
                                is_reported={is_reported}
                                community={community}
                                type={type}
                                openCrosspostForm={() => setIsCrosspostFormOpen(true)}
                                openReportForm={() => setIsReportFormOpen(true)}
                            />
                        </div>
                    </div>
                </div>
                <PostContent 
                    original_post={original_post} 
                    title={title} type={type} 
                    content={content} 
                    link={link} 
                    attachments={attachments} 
                    is_nsfw={is_nsfw}
                    is_spoiler={is_spoiler} 
                />
                <div className="flex items-center gap-3 mt-2">
                    <InteractionButtons 
                        interaction_diff={interaction_diff} 
                        isDownvoted={interaction?.interaction_type === "downvote"}
                        isUpvoted={interaction?.interaction_type === "upvote"}
                        handleDownvote={handleDownvote}
                        handleUpvote={handleUpvote}
                    />
                    <CommentsButton>
                        {comments_count}
                    </CommentsButton>
                    <CopyButton message="Link Copied To Clipboard" text={typeof window === "undefined" ? "" : window.location.href}>
                        <RiShareLine className="text-xl" />
                        <span className="text-sm">
                            Share
                        </span>
                    </CopyButton>
                    {
                        (link || content) &&
                        <CopyButton message="Text Copied To Clipboard" text={content ? content : link ? link : ""}>
                            <FiCopy className="text-xl" />
                            <span className="text-sm">
                                Copy
                            </span>
                        </CopyButton>
                    }
                    {
                        community?.is_moderator &&
                        <div className="ml-auto">
                            <ModeratorPostMenu 
                                id={id}
                                mutate={mutate}
                                data={data}
                                status={status}
                            />
                        </div>
                    }
                </div>
            {/* </Link> */}
            </div>
        </div>
    )
}