"use client"

import Markdown from "react-markdown";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import { KeyedMutator } from "swr";
import CommentsButton from "@/features/common/components/CommentsButton";
import InteractionButtons from "@/features/common/components/InteractionButtons";
import { addCommentInteractionMutation, addCommentInteractionOptions, deleteCommentInteractionMutation, deleteCommentInteractionOptions, updateCommentInteractionMutation, updateCommentInteractionOptions } from "@/lib/mutations";
import CommentMenu from "./CommentMenu";
import CommentEditForm from "./CommentEditForm";
import ModeratorCommentMenu from "./ModeratorCommentMenu";
import UserAvatar from "../../users/components/UserAvatar";
import CommentReportForm from "./CommentReportForm";

type Props = {
    id: number,
    interaction_diff: number,
    interaction: CommentInteraction | null,
    content: string,
    user: User,
    created_at: string,
    post: Post,
    replies?: CommentType[],
    comments: CommentType[],
    is_reported: boolean,
    is_author: boolean,
    mutate: KeyedMutator<unknown>,
}

export default function CommentCard({ id, interaction_diff, interaction, content, user, created_at, is_author, post, replies, mutate, comments, is_reported }: Props) {
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

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
        <div className="pl-2 border-l-[1px] border-secondary">
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
            <div className="flex gap-3">
                <div>
                    <Link className="block pt-1.5" href={`/users/${user.id}`}>
                        <UserAvatar size={30} username={user.username} image={user.image} />
                    </Link>
                </div>
                <div className="flex-1">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link className="text-sm font-medium" href={`/users/${user.id}`}>
                                    <span className="text-sm font-medium">u/{user.username}</span>
                                </Link>
                                <span className="text-xs">
                                    {formatDate(created_at)}
                                </span>
                            </div>
                            <CommentMenu
                                id={id}
                                comments={comments}
                                is_author={is_author}
                                isReportable={!is_author && !!post.community}
                                openReportForm={() => setIsReportFormOpen(true)}
                                is_reported={is_reported}
                                mutate={mutate}
                                openEditForm={() => setIsEditFormOpen(true)}
                            />
                        </div>
                        {
                            isEditFormOpen?
                            <CommentEditForm
                                id={id}
                                content={content}
                                comments={comments}
                                mutate={mutate}
                                closeEditForm={() => setIsEditFormOpen(false)}
                            />
                            :
                            <Markdown className="prose">
                                {content}
                            </Markdown>
                        }
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <InteractionButtons
                            handleDownvote={handleDownvote}
                            handleUpvote={handleUpvote}
                            isDownvoted={interaction?.interaction_type === "downvote"}
                            isUpvoted={interaction?.interaction_type === "upvote"}
                            interaction_diff={interaction_diff}
                        />
                        <CommentsButton onClick={() => setIsReplyFormOpen(!isReplyFormOpen)}>
                            Reply
                        </CommentsButton>
                        <div className="ml-auto">
                            <ModeratorCommentMenu />
                        </div>
                    </div>
                    {
                        isReplyFormOpen &&
                        <div className="mt-3">
                            <CommentForm onComment={() => setIsReplyFormOpen(false)} comments={comments} mutate={mutate} postId={post.id} replyToId={id} />
                        </div>
                    }
                    <div className="pl-2 mt-2">
                        {
                            replies?.map(reply => {
                                return (
                                    <CommentCard comments={comments} mutate={mutate} key={reply.id} {...reply} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}