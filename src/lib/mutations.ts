import { redirect } from "next/navigation";
import { 
    createBan,
    createComment, 
    createCommentInteraction, 
    createCommentReport, 
    createInteraction, 
    createMessage, 
    createPostReport, 
    deleteBan,
    deleteBlock, 
    deleteComment, 
    deleteCommentInteraction, 
    deleteInteraction, 
    deleteMessage, 
    deletePost, 
    deleteSavedPost, 
    savePost, 
    updateComment, 
    updateCommentInteraction, 
    updateCommentReport, 
    updateInteraction, 
    updateMember, 
    updateMessage, 
    updatePost, 
    updatePostReport 
} from "./actions";
import getTokens from "./getTokens";

export const addMessageMutation = async (newMessage: { content: string, chat: number }, messages: Message[]) => {
    const createdMessage = await createMessage(newMessage);
    return [createdMessage, ...messages];
}

export const addMessageOptions = (newMessage: Message, messages: Message[]) => {
    return {
        optimisticData: [newMessage, ...messages],
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    }
}

export const updateMessageMutation = async (messageId: number, data: Partial<Message>, messages: Message[]) => {
    const updatedMessage = await updateMessage(messageId, data);
    return messages.map(message => message.id === messageId ? updatedMessage : message);
}

export const updateMessageOptions = (messageId: number, data: Partial<Message>, messages: Message[]) => {
    return {
        optimisticData: messages.map(message => {
            if (message.id === messageId) {
                return {
                    ...message,
                    ...data,
                };
            }
            return message;
        }),
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    }
}

export const deleteMessageMutation = async (messageId: number, messages: Message[]) => {
    await deleteMessage(messageId);
    return messages.filter(message => message.id !== messageId);
}

export const deleteMessageOptions = (messageId: number, messages: Message[]) => {
    return {
        optimisticData: messages.filter(message => message.id !== messageId),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const updatePostMutation = async <T extends Post | Post[][]>(postId: number, data: Partial<Post>, postData: T): Promise<T> => {
    const updatedPost = await updatePost(postId, data);
    return Array.isArray(postData) ? postData.map(posts => posts.map(post => post.id === postId ? updatedPost : post)) : updatedPost;
}

export const updatePostOptions = <T extends Post | Post[][]>(postId: number, data: Partial<Post>, postData: T) => {
    return {
        optimisticData: Array.isArray(postData) ? postData.map(posts => posts.map(post => post.id === postId ? { ...post, ...data } : post)) as T : { ...postData, ...data } as T,
        populateCache: true,
        rollbackOnError: true,
        revalidate: true,
    };
}

export const deletePostMutation = async <T extends Post | Post[][]>(postId: number, data: T): Promise<T> => {
    await deletePost(postId);
    if (!Array.isArray(data)) {
        redirect("/");
    }
    return data.map(posts => posts.filter(post => post.id !== postId)) as T;
}

export const deletePostOptions = <T extends Post | Post[][]>(postId: number, postData: T) => {
    if (!Array.isArray(postData)) {
        redirect("/");
    }
    return {
        optimisticData: postData.map(posts => posts.filter(post => post.id !== postId)) as T,
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    };
}

export const savePostMutation = async <T extends Post | Post[][]>(postId: number, postData: T): Promise<T> => {
    const savedPost: SavedPost = await savePost(postId);
    return Array.isArray(postData) ? postData.map(posts => posts.map(post => post.id === postId ? {...post, saved_post_id: savedPost.id } : post)) as T : { ...postData, saved_post_id: savedPost.id };
}

export const savePostOptions = <T extends Post | Post[][]>(postId: number, postData: T) => {
    return {
        optimisticData: Array.isArray(postData) ? postData.map(posts => posts.map(post => post.id === postId ? {...post, saved_post_id: Math.random() } : post)) as T : { ...postData, saved_post_id: Math.random() },
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    };
}

export const deleteSavedPostMutation = async <T extends Post | Post[][]>(savedPostId: number, data: T): Promise<T> => {
    await deleteSavedPost(savedPostId);
    if (Array.isArray(data)) {
        return data.map(posts => posts.map(post => post.saved_post_id === savedPostId ? {...post, saved_post_id: null } : post)) as T;
    }
    else {
        return { ...data, saved_post_id: null } as T;
    }
}

export const deleteSavedPostOptions = <T extends Post | Post[][]>(savedPostId: number, data: T) => {
    let optimisticData;
    if (Array.isArray(data)) {
        optimisticData = data.map(posts => posts.map(post => post.saved_post_id === savedPostId ? {...post, saved_post_id: null } : post)) as T;
    }
    else {
        optimisticData = { ...data, saved_post_id: null } as T;
    }
    return {
        optimisticData: optimisticData,
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    }
}

export const addPostInteractionMutation = async <T extends Post | Post[][]>(data: { interaction_type: InteractionType, post: number }, postData: T): Promise<T> => {
    const interaction = await createInteraction(data);
    const handleCreate = (post: Post) => {
        if (post.id === data.post) {
            return {
                ...post,
                interaction,
                interaction_diff: data.interaction_type === "upvote" ? post.interaction_diff + 1 : post.interaction_diff - 1,
            }
        }
        return post;
    }
    return Array.isArray(postData) ? postData.map(posts => posts.map(post => handleCreate(post))) as T : handleCreate(postData) as T;
}

export const addPostInteractionOptions = <T extends Post | Post[][]>(data: { interaction_type: InteractionType, post: number }, postData: T) => {
    const handleCreate = (post: Post) => {
        if (post.id === data.post) {
            return {
                ...post,
                interaction: {
                    id: Math.random(),
                    ...data
                },
                interaction_diff: data.interaction_type === "upvote" ? post.interaction_diff + 1 : post.interaction_diff - 1,
            }
        }
        return post;
    }
    return {
        optimisticData: Array.isArray(postData) ? postData.map(posts => posts.map(post => handleCreate(post))) as T : handleCreate(postData) as T,
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    }
}

export const updatePostInteractionMutation = async <T extends Post | Post[][]>(interactionId: number, data: { interaction_type: InteractionType }, postData: T): Promise<T> => {
    const updatedInteraction = await updateInteraction(data, interactionId);
    const handleUpdate = (post: Post) => {
        if (post.interaction?.id === interactionId) {
            return {
                ...post,
                interaction: updatedInteraction,
                interaction_diff: data.interaction_type === "upvote" ? post.interaction_diff + 2 : post.interaction_diff - 2,
            }
        }
        return post;
    }
    return Array.isArray(postData) ? postData.map(posts => posts.map(post => handleUpdate(post))) as T : handleUpdate(postData) as T;
}

export const updatePostInteractionOptions = <T extends Post | Post[][]>(interactionId: number, data: { interaction_type: InteractionType }, postData: T) => {
    const handleUpdate = (post: Post) => {
        if (post.interaction?.id === interactionId) {
            return {
                ...post,
                interaction: {
                    ...post.interaction,
                    interaction_type: data.interaction_type
                },
                interaction_diff: data.interaction_type === "upvote" ? post.interaction_diff + 2 : post.interaction_diff - 2,
            }
        }
        return post;
    }
    return {
        optiomisticData: Array.isArray(postData) ? postData.map(posts => posts.map(post => handleUpdate(post))) : handleUpdate(postData),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const deleteInteractionMutation = async <T extends Post | Post[][]>(interactionId: number, data: T): Promise<T> => {
    await deleteInteraction(interactionId);
    const handleDelete = (post: Post) => {
        if (post.interaction?.id === interactionId) {
            return {
                ...post,
                interaction: null,
                interaction_diff: post.interaction.interaction_type === "downvote" ? post.interaction_diff + 1 : post.interaction_diff - 1,
            }
        }
        return post;
    }
    return Array.isArray(data) ? data.map(posts => posts.map(post => handleDelete(post))) as T : handleDelete(data) as T;
}

export const deleteInteractionOptions = <T extends Post | Post[][]>(interactionId: number, data: T) => {
    const handleDelete = (post: Post) => {
        if (post.interaction?.id === interactionId) {
            return {
                ...post,
                interaction: null,
                interaction_diff: post.interaction.interaction_type === "downvote" ? post.interaction_diff + 1 : post.interaction_diff - 1,
            }
        }
        return post;
    }
    return {
        optimisticData: Array.isArray(data) ? data.map(posts => posts.map(post => handleDelete(post))) as T : handleDelete(data) as T,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const updatePostReportMutation = async (reportId: number, data: Partial<PostReport>, reports: PostReport[]) => {
    const updatedReport = await updatePostReport(reportId, data);
    return reports.map(report => report.id === reportId ? updatedReport : report);
}

export const updatePostReportOptions = (reportId: number, data: Partial<PostReport>, reports: PostReport[]) => {
    return {
        optimisticData: reports.map(report => {
            if (report.id === reportId) {
                return {
                    ...report,
                    ...data,
                }
            }
            return report;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
    }
}

export const updateCommentReportMutation = async (reportId: number, data: Partial<CommentReport>, reports: CommentReport[]) => {
    const updatedReport = await updateCommentReport(reportId, data);
    return reports.map(report => report.id === reportId ? updatedReport : report);
}

export const updateCommentReportOptions = (reportId: number, data: Partial<CommentReport>, reports: CommentReport[]) => {
    return {
        optimisticData: reports.map(report => {
            if (report.id === reportId) {
                return {
                    ...report,
                    ...data,
                }
            }
            return report;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
    }
}

export const addCommentMutation = async (data: { post: number, content: string, parent?: number }, comments: CommentType[]) => {
    const newComment = await createComment(data);
    if (data.parent) {
        return comments.map(comment => {
            if (comment.id === data.parent) {
                return {
                    ...comment,
                    replies: [newComment, ...comment.replies],
                }
            }
            return comment;
        });
    }
    else {
        return [newComment, ...comments];
    }
}

export const addCommentOptions = (data: { post: number, content: string, parent?: number }, comments: CommentType[], user?: Partial<User>) => {
    console.log(user)
    const newComment = { 
        ...data, 
        created_at: new Date().toISOString(), 
        user: user,
        interaction: null,
        interaction_diff: 0,
    };
    const optimisticData = data.parent ? comments.map(comment => {
        if (comment.id === data.parent) {
            return {
                ...comment,
                replies: [newComment, ...comment.replies],
            }
        }
        return comment;
    }) : [newComment, ...comments];
    return {
        optimisticData,
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    };
}

export const updateCommentInteractionMutation = async (interactionId: number, data: { interaction_type: InteractionType }, comments: CommentType[]) => {
    const updatedInteraction = await updateCommentInteraction(data, interactionId);
    return updateComments(comments, (comment): CommentType => {
        if (comment.interaction?.id === interactionId) {
            return {
                ...comment,
                interaction: updatedInteraction,
                interaction_diff: data.interaction_type === "upvote" ? comment.interaction_diff + 2 : comment.interaction_diff - 2
            }
        }
        return comment;
    });
}

export const updateCommentInteractionOptions = (interactionId: number, data: { interaction_type: InteractionType }, comments: CommentType[]) => {
    return {
        optiomisticData: updateComments(comments, (comment): CommentType => {
            if (comment.interaction?.id === interactionId) {
                return {
                    ...comment,
                    interaction: {
                        ...comment.interaction,
                        interaction_type: data.interaction_type
                    },
                    interaction_diff: data.interaction_type === "upvote" ? comment.interaction_diff + 2 : comment.interaction_diff - 2
                }
            }
            return comment;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const addCommentInteractionMutation = async (data: { interaction_type: InteractionType, comment: number }, comments: CommentType[]) => {
    const newInteraction = await createCommentInteraction(data);
    return updateComments(comments, (comment): CommentType => {
        if (comment.id === data.comment) {
            return {
                ...comment,
                interaction: newInteraction,
                interaction_diff: data.interaction_type === "upvote" ? comment.interaction_diff + 1 : comment.interaction_diff - 1
            }
        }
        return comment;
    });
}

export const addCommentInteractionOptions = (data: { interaction_type: InteractionType, comment: number }, comments: CommentType[]) => {
    return {
        optimisticData: updateComments(comments, (comment): CommentType => {
            if (comment.id === data.comment) {
                return {
                    ...comment,
                    interaction: {
                        id: Math.floor(Math.random()),
                        ...data
                    },
                    interaction_diff: data.interaction_type === "upvote" ? comment.interaction_diff + 1 : comment.interaction_diff - 1
                }
            }
            return comment;
        }),
        populateCache: true,
        rollbackOnError: true,
        revalidate: false,
    }
}

export const deleteCommentInteractionMutation = async (interactionId: number, comments: CommentType[]) => {
    await deleteCommentInteraction(interactionId);
    return updateComments(comments, (comment): CommentType => {
        if (comment.interaction?.id === interactionId) {
            return {
                ...comment,
                interaction: null,
                interaction_diff: comment.interaction?.interaction_type === "upvote" ? comment.interaction_diff - 1 : comment.interaction_diff + 1
            }
        }
        return comment;
    });
}

export const deleteCommentInteractionOptions = (interactionId: number, comments: CommentType[]) => {
    return {
        optimisticData: updateComments(comments, (comment): CommentType => {
            if (comment.interaction?.id === interactionId) {
                return {
                    ...comment,
                    interaction: null,
                    interaction_diff: comment.interaction?.interaction_type === "upvote" ? comment.interaction_diff - 1 : comment.interaction_diff + 1
                }
            }
            return comment;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}


const updateComments = (comments: CommentType[], handleUpdate: (comment: CommentType) => CommentType) => {
    return comments.map((comment): CommentType => {
        return handleUpdate({
            ...comment,
            replies: updateComments(comment.replies, handleUpdate),
        });
    });
}

const deleteComments = (commentId: number, comments: CommentType[]) => {
    let filteredComments = comments.filter(comment => comment.id !== commentId);
    filteredComments = filteredComments.map(comment => ({
        ...comment,
        replies: deleteComments(commentId, comment.replies),
    }))
    return filteredComments;
}

export const deleteCommentMutation = async (commentId: number, comments: CommentType[]) => {
    await deleteComment(commentId);
    return deleteComments(commentId, comments);
}

export const deleteCommentOptions = (commentId: number, comments: CommentType[]) => {
    return {
        optimisticData: deleteComments(commentId, comments),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    };
}

export const updateCommentMutation = async (commentId: number, data: { content: string }, comments: CommentType[]) => {
    const updatedComment = await updateComment(data, commentId);
    return updateComments(comments, (comment) => {
        if (comment.id === commentId) {
            return {
                ...comment,
                ...updatedComment,
            }
        }
        return comment;
    });
}

export const updateCommentOptions = (commentId: number, data: { content: string }, comments: CommentType[]) => {
    return {
        optimisticData: updateComments(comments, (comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    ...data,
                }
            }
            return comment;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const deleteBlockMutation = async (blockId: number, users: User[]) => {
    await deleteBlock(blockId);
    return users.filter(user => user.block_id !== blockId);
}

export const deleteBlockOptions = (blockId: number, users: User[]) => {
    return  {
        optimisticData: users.filter(user => user.block_id !== blockId),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const createPostReportMutation = async <T extends Post | Post[][]>(data: { post: number, reason: string, violated_rule?: number }, postsData: T): Promise<T> => {
    await createPostReport(data);
    return Array.isArray(postsData) ? postsData.map(posts => posts.map(post => post.id === data.post ? {...post, is_reported: true} : post)) as T : {...postsData, is_reported: true} as T;
}

export const createPostReportOptions = <T extends Post | Post[][]>(data: { post: number, reason: string, violated_rule?: number }, postData: T) => {
    return {
        optimisticData: Array.isArray(postData) ? postData.map(posts => posts.map(post => post.id === data.post ? {...post, is_reported: true} : post)) as T : { ...postData, is_reported: true } as T,
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const createCommentReportMutation = async (data: { comment: number, reason: string, violated_rule?: number }, comments: CommentType[]) => {
    await createCommentReport(data);
    return updateComments(comments, (comment) => comment.id === data.comment ? {...comment, is_reported: true} : comment);
}

export const createCommentReportOptions = (data: { comment: number, reason: string, violated_rule?: number }, comments: CommentType[]) => {
    return {
        optimisticData: updateComments(comments, (comment) => comment.id === data.comment ? {...comment, is_reported: true} : comment),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const createBanMutation = async (data: { user: number, community: number, reason: string, expires_at: string | null, is_permanent: boolean }, members: Member[]) => {
    const ban = await createBan(data);
    return members.map(member => {
        if (member.user.id === data.user) {
            return {
                ...member,
                ban,
            }
        }
        return member;
    });
}

export const createBanOptions = (data: { user: number, community: number, reason: string, expires_at: string | null, is_permanent: boolean }, members: Member[]) => {
    return {
        optimisticData: members.map(member => {
            if (member.user.id === data.user) {
                return {
                    ...member,
                    ban: {
                        id: Math.random(),
                        user: member.user.id,
                        community: member.community,
                        reason: data.reason,
                        banned_at: new Date().toISOString(),
                        expires_at: data.expires_at,
                        is_permanent: data.is_permanent,
                        is_active: true,
                    },
                }
            }
            return member;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}

export const deleteBanMutation = async (banId: number, members: Member[]) => {
    await deleteBan(banId);
    return members.map(member => {
        if (member.ban?.id === banId) {
            return {
                ...member,
                ban: null,
            }
        }
        return member;
    });
}

export const deleteBanOptions = (banId: number, members: Member[]) => {
    return {
        optimisticData: members.map(member => {
            if (member.ban?.id === banId) {
                return {
                    ...member,
                    ban: null,
                }
            }
            return member;
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}


export const updateMemberMutation = async (memberId: number, data: Partial<Member>, members: Member[]) => {
    await updateMember(memberId, data);
    return members.map(member => member.id === memberId ? {...member, ...data} : member);
}

export const updateMemberOptions = (memberId: number, data: Partial<Member>, members: Member[]) => {
    return {
        optimisticData: members.map(member => member.id === memberId ? {...member, ...data} : member),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
    }
}