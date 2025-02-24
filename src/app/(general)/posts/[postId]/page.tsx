import type { Metadata } from "next";
import getPost from "@/lib/getPost";
import getPosts from "@/lib/getPosts";
import Comments from "@/features/comments/components/Comments";
import Post from "@/features/posts/components/Post";

type Params = {
    params: Promise<{
        postId: string;
    }>
}

export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const postId = Number.parseInt((await params).postId);
    const post: Post = await getPost(postId);
    return {
        title: `Post - ${post.title}`,
        description: post.content,
    }
}

export default async function PostPage({ params }: Params) {
    const postId = Number.parseInt((await params).postId);
    const post: Post = await getPost(postId);
    return (
        <section>
            <Post post={post}  />
            <Comments postId={post.id} />
        </section>
    );
}

export async function generateStaticParams() {
    const posts: Post[] = await getPosts();
    return posts.map((post) => ({
        postId: post.id.toString(),
    }));
}