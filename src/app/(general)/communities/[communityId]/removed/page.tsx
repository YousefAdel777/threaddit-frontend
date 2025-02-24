import RemovedPosts from "@/features/posts/components/RemovedPosts";
import withModeratorAuth from "@/lib/withModeratorAuth";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export default async function Removed({ params }: Params) {
    const communityId = Number.parseInt((await params).communityId);
    await withModeratorAuth(communityId);
    return (
        <RemovedPosts communityId={communityId} />
    )
}