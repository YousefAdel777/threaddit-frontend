import PendingPosts from "@/features/posts/components/PendingPosts";
import withModeratorAuth from "@/lib/withModeratorAuth";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export default async function Pending({ params }: Params) {
    const communityId = Number.parseInt((await params).communityId);
    await withModeratorAuth(communityId);
    return (
        <PendingPosts communityId={communityId} />
    )
}