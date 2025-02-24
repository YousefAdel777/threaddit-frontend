import Upvoted from "@/features/users/components/Upvoted";
import withCurrentUserAuth from "@/lib/withCurrentUserAuth";

type Params = {
    params: Promise<{
        userId: string;
    }>
}

export default async function UpvotedPage({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    await withCurrentUserAuth(userId);
    return (
        <Upvoted />
    );
}