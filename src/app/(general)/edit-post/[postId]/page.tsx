import { auth } from "@/app/api/auth/[...nextauth]/route";
import EditPostForm from "@/features/posts/components/EditPostForm";
import getPost from "@/lib/getPost";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{
        postId: string;
    }>
}


export default async function EditPostPage({ params }: Props) {
    const postId = Number.parseInt((await params).postId);
    const [post, session] = await Promise.all([
        getPost(postId),
        auth()
    ]);

    if (!post || session?.userId !== post.user.id.toString()) {
        redirect("/");
    }

    return (
        <EditPostForm post={post} />
    );
}