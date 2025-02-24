"use server"
import { Session } from "inspector/promises";
import api from "./apiAxios";
import { auth, signIn, update, signOut } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getTokens from "./getTokens";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;



export async function loginWithGithub(code: string) {
    // try {
    //     const res = await api.post(`/api/auth/github/`, {
    //         code
    //     });
    //     const { user, access, refresh } = res.data;
    //     await signIn("oauth", { accessToken: access, refreshToken: refresh, user, redirect: false });
    //     return res.data;
    // } catch (error) {
    //     console.log(error.response?.data);
    //     return { error: "Failed to login with GitHub" };
    // }
    const res = await fetch(`${BASE_URL}/api/auth/github/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ code }),
    });

    if (!res.ok) {
        return { error: "Failed to login with GitHub" };
    }

    const data = await res.json();
    await signIn("oauth", {
        accessToken: data.access,
        refreshToken: data.refresh,
        user: data.user,
        redirect: false,
    });
}

export const deleteAccount = async () => {
    // try {
    //     const res = await api.delete('/auth/user/');
    //     return res.data;
    // } catch (error) {
    //     console.log(error.response?.data);
    //     return { error: "Failed to delete account" };
    // }
    const accessToken = (await getTokens()).accessToken;
    const res = await fetch(`${BASE_URL}/auth/user/`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json" ,
            "Authorization": `Bearer ${accessToken}`
        },
    });
    if (!res.ok) {
        return { error: "Failed to delete account" };
    }
    return res.json();
}

export const loginWithGoogle = async (code: string) => {
    // try {
    //     const res = await api.post(`/api/auth/google/`, {
    //         code
    //     });
    //     const { user, access, refresh } = res.data;
    //     await signIn("oauth", { accessToken: access, refreshToken: refresh, user, redirect: false });
    //     return res.data;
    // } catch (error) {
    //     console.log(error.response?.data);
    //     return { error: "Failed to login with Google" };
    // }
    const res = await fetch(`${BASE_URL}/api/auth/google/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ code }),
    });

    if (!res.ok) {
        return { error: "Failed to login with Google" };
    }

    const data = await res.json();
    await signIn("oauth", {
        accessToken: data.access,
        refreshToken: data.refresh,
        user: data.user,
        redirect: false,
    });
}

export const logout = async () => {
    // const session = await auth();
    // if (!session?.refreshToken) {
    //     return;
    // }
    // try {
    //     const res = await api.post(`/auth/logout/`, {
    //         refresh: session.refreshToken
    //     });
    //     return res.data;
    // } catch (error) {
    //     console.log(error.response?.data);
    //     return { error: "Failed to logout" };
    // }
    const refreshToken = (await getTokens()).refreshToken;
    const res = await fetch(`${BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) {
        return { error: "Failed to logout" };
    }
    return res.json();
}

export async function createPost(formData: FormData) {
    try {
        const res = await api.post('/api/posts/', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return res.data;
    }
    catch (error) {
        console.log(error.response.data);
        return { error: "Failed to create post" };
    }
}

export async function updatePost(postId: number, data: Partial<Post> | FormData) {
    try {
        const res = await api.patch(`/api/posts/${postId}/`, data, {
            headers: {
                "Content-Type": data instanceof FormData ? "multipart/form-data" : "application/json",
            }
        });
        revalidatePath("/posts");
        revalidatePath("/edit-post");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update post" };
    }
}

export async function updatePostWithFiles(postId: number, data: FormData) {
    try {
        const res = await api.patch(`/api/posts/${postId}/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update post" };
    }
}

export async function createCommunity(formData: FormData) {
    try {
        const res = await api.post('/api/communities/', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        revalidatePath("/")
        return res.data
    }
    catch (error: any) {
        if (error.response?.data?.name) {
            return { error: "A community with that name already exists" };
        }
        console.log(error);
        
        return { error: "Failed to create community" };
    }
}

export async function updateSession(session: Partial<Session>) {
    try {
        await update(session);
    }
    catch (error) {
        console.log(error);
    }
}

export async function createMember(communityId: number) {
    try {
        const res = await api.post(`/api/members/`, { community: communityId });
        revalidatePath("/communities");
        return res.data;
    }
    catch (error) {
        console.log(error.response.data);
        return { error: "Failed to create member" };
    }
}

export async function deleteMember(memberId: number) {
    try {
        const res = await api.delete(`/api/members/${memberId}/`);
        revalidatePath("/communities");
        // return res.data;
    }
    catch (error) {
        console.log(error);
        // return { error: "Failed to create member" };
    }
}

export async function savePost(postId: number) {
    try {
        const res = await api.post(`/api/saved-posts/`, { post: postId });
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to save post" };
    }
}

export async function deleteSavedPost(savedPostId: number) {
    try {
        const res = await api.delete(`/api/saved-posts/${savedPostId}/`);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete saved post" };
    }
}

export async function deletePost(postId: number) {
    try {
        const res = await api.delete(`/api/posts/${postId}/`);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete post" };
    }
}

export async function createInteraction(data: { post: number, interaction_type: string }) {
    // try {
    //     const res = await api.post(`/api/interactions/`, data);
    //     revalidatePath("/posts");
    //     return res.data;
    // }
    // catch(error) {
    //     console.log(error.response?.data);
    //     return { error: "Failed to create interaction" };
    // }
    const accessToken = (await getTokens()).accessToken;
    const res = await fetch(`${BASE_URL}/api/interactions/`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        return { error: "Failed to create interaction" };
    }
    return res.json();
}

export async function deleteInteraction(interactionId: number) {
    try {
        const res = await api.delete(`/api/interactions/${interactionId}/`);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete interaction" };
    }
}

export async function updateInteraction(data: { interaction_type: string }, interactionId: number) {
    try {
        const res = await api.patch(`/api/interactions/${interactionId}/`, data);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update post" };
    }
}

export async function createCommentInteraction(data: { comment: number, interaction_type: string }) {
    try {
        const res = await api.post(`/api/comments-interactions/`, data);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to create interaction" };
    }
}

export async function deleteCommentInteraction(interactionId: number) {
    try {
        const res = await api.delete(`/api/comments-interactions/${interactionId}/`);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete interaction" };
    }
}

export async function updateCommentInteraction(data: { interaction_type: string }, interactionId: number) {
    try {
        const res = await api.patch(`/api/comments-interactions/${interactionId}/`, data);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update interaction" };
    }
}

export async function createComment(data: { post: number, content: string, parent?: number }): Promise<CommentType> {
    try {
        const res = await api.post(`/api/comments/`, data);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to create comment" };
    }
}

export async function updateComment(data: { content: string }, commentId: number) {
    try {
        const res = await api.patch(`/api/comments/${commentId}/`, data);
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update comment" };
    }
}

export async function deleteComment(commentId: number) {
    try {
        const res = await api.delete(`/api/comments/${commentId}/`);
        revalidatePath("/posts");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete comment" };
    }
}

export async function updateCommunity(communityId: number, data: FormData) {
    try {
        const res = await api.patch(`/api/communities/${communityId}/`, data);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error?.response?.data);
        return { error: "Failed to update community" }
    }
}

export async function createBlock(data: { blocked_user: number }) {
    const session = await auth();
    if (!session) {
        redirect("/signin");
    } 
    try {
        const res = await api.post('/api/blocks/', data);
        revalidatePath("/users");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to block user" }
    }
}

export async function deleteBlock(blockId: number) {
    try {
        const res = await api.delete(`/api/blocks/${blockId}/`);
        revalidatePath("/users");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to unblock user" }
    }
}

export async function createFollow(data: { followed: number }) {
    try {
        const res = await api.post('/api/follows/', data);
        revalidatePath("/users");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to follow user" }
    }
}

export async function deleteFollow(followId: number) {
    try {
        const res = await api.delete(`/api/follows/${followId}/`);
        revalidatePath("/users");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to unfollow user" }
    }
}

export async function updateUser(data: FormData) {
    try {
        const res = await api.patch('/auth/user/', data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
        revalidatePath("/users");
        return res.data;
    }
    catch(error) {
        console.log(error?.response?.data);
        return { error: "Failed to update profile" }
    }
}

export async function createFavorite(data: { community: number }) {
    try {
        const res = await api.post(`/api/favorites/`, data);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to add community to favorites" }
    }
}

export async function deleteFavorite(favoriteId) {
    try {
        const res = await api.delete(`/api/favorites/${favoriteId}/`);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete community from favorites" }
    }
}

export async function createRule(data: { community: number, title: string, description: string }) {
    try {
        const res = await api.post('/api/rules/', data);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to create rule" }
    }
}

export async function deleteRule(ruleId: number) {
    try {
        const res = await api.delete(`/api/rules/${ruleId}/`);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete rule" }
    }
}

export async function updateMember(member_id: number, data: Partial<Member>) {
    try {
        const res = await api.patch(`/api/members/${member_id}/`, data);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update member" }
    }
}

export async function createBan(data: { user: number, community: number, reason: string, is_permanent: boolean, expires_at: string | null }) {
    try {
        const res = await api.post('/api/bans/', data);
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to ban member" }
    }
}

export async function deleteBan(banId: number) {
    try {
        const res = await api.delete(`/api/bans/${banId}/`);
        revalidatePath("/communities");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to unban member" }
    }
}

export const updateNotification = async (notification_id: number, data: Partial<NotificationType>) => {
    try {
        const res = await api.patch(`/api/notifications/${notification_id}/`, data);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update notification" }
    }
}

export const createMessage = async (data: { content: string, chat: number }) => {
    try {
        const res = await api.post(`/api/messages/`, data);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to send message" }
    }
}

export const updateMessage = async (messageId: number, data: Partial<Message>) => {
    try {
        const res = await api.patch(`/api/messages/${messageId}/`, data);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to update message" }
    }
} 

export const deleteMessage = async (message_id: number) => {
    try {
        const res = await api.delete(`/api/messages/${message_id}/`);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to delete message" }
    }
}

export const createChat = async (data: { participants: number[] }) => {
    try {
        const res = await api.post(`/api/chats/`, data);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to create chat" }
    }
}

export const createPostReport = async (data: { post: number, reason: string, violated_rule?: number }) => {
    try {
        const res = await api.post(`/api/post-reports/`, data);
        return res.data;
    }
    catch(error) {
        console.log(error);
        return { error: "Failed to report post" }
    }
}

export const updatePostReport = async (reportId: number, data: Partial<PostReport>) => {
    try {
        const res = await api.patch(`/api/post-reports/${reportId}/`, data);
        return res.data;
    }
    catch(error) {
        console.log(error);
        return { error: "Failed to update post report" }
    }
}

export const createCommentReport = async (data: { comment: number, reason: string, violated_rule?: number }) => {
    console.log(data);
    try {
        const res = await api.post(`/api/comment-reports/`, data);
        revalidatePath("/");
        return res.data;
    }
    catch(error) {
        console.log(error.response?.data);
        return { error: "Failed to report comment" }
    }
}

export const updateCommentReport = async (reportId: number, data: Partial<CommentReport>) => {
    try {
        const res = await api.patch(`/api/comment-reports/${reportId}/`, data);
        return res.data;
    }
    catch(error) {
        console.log(error);
        return { error: "Failed to update comment report" }
    }
}

export const markAsRead = async (chatId: number) => {
    const accessToken = (await getTokens()).accessToken;
    const res = await fetch(`${BASE_URL}/api/mark-as-read/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" ,
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ chat: chatId })
    });
    if (!res.ok) {
        return { error: "Failed to mark messages as read" };
    }
    return res.json();
}