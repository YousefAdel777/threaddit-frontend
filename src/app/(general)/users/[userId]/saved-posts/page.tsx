import SavedPosts from "@/features/posts/components/SavedPosts";
import withCurrentUserAuth from "@/lib/withCurrentUserAuth";

type Params = {
    params: Promise<{
        userId: string
    }>
}

export default async function SavedPostsPage({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    await withCurrentUserAuth(userId);
    return (
        <SavedPosts userId={userId} />
    )
}