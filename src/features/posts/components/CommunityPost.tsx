"use client"
import { KeyedMutator } from "swr";
import CommunityPostHeader from "./CommunityPostHeader";
import PostContent from "./PostContent";
import InteractionButtons from "@/features/common/components/InteractionButtons";
import { addPostInteractionMutation, addPostInteractionOptions, deleteInteractionMutation, deleteInteractionOptions, updatePostInteractionMutation, updatePostInteractionOptions } from "@/lib/mutations";
import CommentsButton from "@/features/common/components/CommentsButton";
import CopyButton from "@/features/common/components/CopyButton";
import { RiShareLine } from "react-icons/ri";
import { FiCopy } from "react-icons/fi";
import ModeratorPostMenu from "./ModeratorPostMenu";
import ReportForm from "./PostReportForm";
import { useEffect, useState } from "react";
import CrossPostModal from "./CrossPostModal";
import { InfiniteKeyedMutator } from "swr/infinite";
import { useRouter } from "next/navigation";

type Props<T> = {
    id: number;
    user: User;
    type: PostType;
    status: PostStatus;
    content?: string;
    title: string;
    link?: string;
    created_at: string;
    saved_post_id: number | null;
    original_post: Post | null;
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

export default function CommunityPost<T extends Post | Post[][]>({ type, content, title, link, original_post, user, created_at, id, saved_post_id, attachments, interaction, interaction_diff, comments_count, is_author, community, data, mutate, status, is_reported, is_spoiler, is_nsfw }: Props<T>) {
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [isCrosspostFormOpen, setIsCrosspostFormOpen] = useState(false);
    console.log(interaction);
    const router = useRouter();
    
    const handleUpvote = async () => {
        if (interaction?.interaction_type === "upvote") {
            await mutate(
                await deleteInteractionMutation(interaction.id, data), 
                deleteInteractionOptions(interaction.id, data)
            );
        }
        else if (interaction?.interaction_type === "downvote") {
            await mutate(
                await updatePostInteractionMutation(interaction.id, { interaction_type: "upvote" }, data),
                updatePostInteractionOptions(interaction.id, { interaction_type: "upvote" }, data)
            );
        }
        else {
            await mutate( 
                await addPostInteractionMutation({ interaction_type: "upvote", post: id }, data), 
                addPostInteractionOptions({ interaction_type: "upvote", post: id }, data)
            );
        }
    }

    const handleDownvote = async () => {
        if (interaction?.interaction_type === "downvote") {
            await mutate(
                await deleteInteractionMutation(interaction.id, data), 
                deleteInteractionOptions(interaction.id, data)
            );
        }
        else if (interaction?.interaction_type === "upvote") {
            await mutate(
                await updatePostInteractionMutation(interaction.id, { interaction_type: "downvote" }, data),
                updatePostInteractionOptions(interaction.id, { interaction_type: "downvote" }, data)
            );
        }
        else {
            await mutate(
                await addPostInteractionMutation({ interaction_type: "downvote", post: id }, data), 
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
                <ReportForm data={data} mutate={mutate} closeModal={() => setIsReportFormOpen(false)} postId={id} communityId={community?.id} />
            }
            {
                isCrosspostFormOpen &&
                <CrossPostModal closeModal={() => setIsCrosspostFormOpen(false)} postId={id} />
            }
            <div onClick={() => router.push(`/posts/${id}`)} className="hover:bg-secondary cursor-pointer block duration-100 py-2 px-4 rounded-lg">
                <CommunityPostHeader
                    id={id}
                    created_at={created_at}
                    saved_post_id={saved_post_id}
                    is_author={is_author}
                    is_reported={is_reported}
                    data={data}
                    mutate={mutate}
                    user={user}
                    status={status}
                    community={community}
                    type={type}
                    openReportForm={() => setIsReportFormOpen(true)}
                    openCrossPostForm={() => setIsCrosspostFormOpen(true)}
                />
                <PostContent original_post={original_post} title={title} type={type} content={content} link={link} attachments={attachments} is_nsfw={is_nsfw} is_spoiler={is_spoiler} />
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
                    <CopyButton message="Link Copied To Clipboard" text={window.location.href}>
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
                            <ModeratorPostMenu status={status} id={id} mutate={mutate} data={data} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}