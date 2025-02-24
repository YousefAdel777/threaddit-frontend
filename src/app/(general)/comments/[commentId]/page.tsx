import type { Metadata } from "next";
import getComment from "@/lib/getComment";
import getComments from "@/lib/getComments";
import Comments from "@/features/comments/components/Comments";
import Button from "@/features/common/components/Button";
import Link from "next/link";
import Post from "@/features/posts/components/Post";
import getPost from "@/lib/getPost";

type Params = {
    params: Promise<{
        commentId: string;
    }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const comment: CommentType = await getComment((await params).commentId);
    return {
        title: `Comment - ${comment.content}`,
        description: comment.content,
    }
}

export default async function CommentsPage({ params }: Params) {
    const comment: CommentType = await getComment((await params).commentId);
    const post: Post = await getPost(comment.post.id);
    return (
        <section>
            <Post post={post} />
            <Comments postId={comment.post.id} />
            <Link href={`/posts/${comment.post.id}`}>
                <Button>
                    Show all comments
                </Button>
            </Link>
        </section>
    );
}

export async function generateStaticParams() {
    const comments: CommentType[] = await getComments();
    return comments.map((comment) => ({
        commentId: comment.id.toString(),
    }));
}