"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { formatDate } from "@/lib/utils";
import InteractionButtons from "@/features/common/components/InteractionButtons";
import { KeyedMutator } from "swr";
import { addCommentInteractionMutation, addCommentInteractionOptions, deleteCommentInteractionMutation, deleteCommentInteractionOptions, updateCommentInteractionMutation, updateCommentInteractionOptions } from "@/lib/mutations";
import UserAvatar from "@/features/users/components/UserAvatar";
import CommentMenu from "./CommentMenu";
import CommunityAvatar from "@/features/communities/components/CommunityAvatar";
import CommentsButton from "@/features/common/components/CommentsButton";
import CommentReportForm from "./CommentReportForm";

type Props = {
    id: number, 
    user: User, 
    content: string, 
    interaction_diff: number, 
    interaction: CommentInteraction, 
    created_at: string, 
    post: Post,
    comments: CommentType[],
    is_author: boolean,
    is_reported: boolean,
    parent?: CommentType,
    mutate: KeyedMutator<unknown>,
}

export default function UserComment({ id, content, comments, mutate, interaction, interaction_diff, user, created_at, post, parent, is_author, is_reported }: Props) {
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);


    const handleUpvote = async () => {
        if (interaction?.interaction_type === "upvote") {
            await mutate(
                deleteCommentInteractionMutation(interaction.id, comments), 
                deleteCommentInteractionOptions(interaction.id, comments)
            );
        }
        else if (interaction?.interaction_type === "downvote") {
            await mutate(
                updateCommentInteractionMutation(interaction.id, { interaction_type: "upvote" }, comments),
                updateCommentInteractionOptions(interaction.id, { interaction_type: "upvote" }, comments)
            );
        }
        else {
            await mutate( 
                addCommentInteractionMutation({ interaction_type: "upvote", comment: id }, comments), 
                addCommentInteractionOptions({ interaction_type: "upvote", comment: id }, comments)
            );
        }
    }

    const handleDownvote = async () => {
        if (interaction?.interaction_type === "downvote") {
            await mutate(
                deleteCommentInteractionMutation(interaction.id, comments), 
                deleteCommentInteractionOptions(interaction.id, comments)
            );
        }
        else if (interaction?.interaction_type === "upvote") {
            await mutate(
                updateCommentInteractionMutation(interaction.id, { interaction_type: "downvote" }, comments),
                updateCommentInteractionOptions(interaction.id, { interaction_type: "downvote" }, comments)
            );
        }
        else {
            await mutate(
                addCommentInteractionMutation({ interaction_type: "downvote", comment: id }, comments), 
                addCommentInteractionOptions({ interaction_type: "downvote", comment: id }, comments)
            );
        }
    }

    useEffect(() => {
        if (isReportFormOpen) {
            document.body.classList.add("overflow-y-hidden");
        }
        else {
            document.body.classList.remove("overflow-y-hidden");
        } 
    }, [isReportFormOpen]);

    return (
        <div className="px-3 py-5 duration-200 hover:bg-secondary">
            {
                (isReportFormOpen && post.community) &&
                <CommentReportForm 
                    communityId={post.community.id} 
                    commentId={id}
                    comments={comments}
                    mutate={mutate}
                    closeModal={() => setIsReportFormOpen(false)} 
                />
            }
            <div className="flex items-start gap-3">
                <Link href={post.community ? `/communities/${post.community.id}` : `/users/${user.id}`} className="flex mt-1 items-center gap-3">
                    {
                        post.community ?
                        <CommunityAvatar size={30} icon={post.community.icon} name={post.community.name} />
                        :
                        <UserAvatar size={30} username={user.username} image={user.image || "/images/user_image.webp"} />
                    }
                </Link>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link href={post.community ? `/communities/${post.community.id}` : `/users/${user.id}`}>
                                {
                                    post.community ?
                                    <p className="text-sm font-semibold hover:underline">t/{post.community.name}</p>
                                    :
                                    <p className="text-sm font-semibold hover:underline">u/{user.username}</p>
                                }
                            </Link>
                            <Link className="text-xs hover:underline" href={`/posts/${post.id}`}>
                                {post.title}
                            </Link>
                        </div>
                        <CommentMenu
                            is_author={is_author}
                            openReportForm={() => setIsReportFormOpen(true)}
                            id={id}
                            comments={comments}
                            is_reported={is_reported}
                            isReportable={!is_author && !!post.community}
                            mutate={mutate}
                        />
                    </div>
                    <p className="text-xs mb-2">
                        <span className="font-semibold">{user.username}</span>{" "}
                        {parent ? "replied" : "commented"} {formatDate(created_at)}
                    </p>
                    <Link href={`/comments/${id}`}>
                        <Markdown className="prose">
                            {content}
                        </Markdown>
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                        <InteractionButtons 
                            interaction_diff={interaction_diff} 
                            isDownvoted={interaction.interaction_type === "downvote"}
                            isUpvoted={interaction.interaction_type === "upvote"}
                            handleDownvote={handleDownvote}
                            handleUpvote={handleUpvote}
                        />
                        <Link href={`/comments/${id}`}>
                            <CommentsButton>
                                Reply
                            </CommentsButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}