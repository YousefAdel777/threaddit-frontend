import Downvoted from "@/features/users/components/Downvoted";
import withCurrentUserAuth from "@/lib/withCurrentUserAuth";

type Params = {
    params: Promise<{
        userId: string;
    }>
}

export default async function DownvotedPosts({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    await withCurrentUserAuth(userId);
    return (
        <Downvoted />
    )
}