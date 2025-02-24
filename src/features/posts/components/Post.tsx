"use client";

import useSWR from "swr";
import UserPost from "./UserPost";
import Loading from "@/features/common/components/Loading";
import { useEffect } from "react";
import { useRecentPostsStore } from "@/stores/recentPostsStore";

type Props = {
    post: Post;
}

const Post = ({ post }: Props) => {
    const { data, mutate, isLoading, error } = useSWR<Post>(`/api/posts/${post.id}/`, {
        fallbackData: post,
        fallback: post,
        revalidateOnFocus: false
    });
    const { addPost } = useRecentPostsStore();

    useEffect(() => {
        if (post) {
            addPost({
                id: post.id,
                title: post.title,
                user: post.user,
                community: post.community
            });
        }
    }, [post, addPost]);

    if (isLoading) {
        return (
            <Loading text="Loading post..." />
        );
    }

    if (error || !data) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">
                Something went wrong.
            </h2>
        );
    }

    return (
        <UserPost data={data} mutate={mutate} {...data}   />
    );
}

export default Post;