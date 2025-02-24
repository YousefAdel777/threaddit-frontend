import Blocked from "@/features/block/components/Blocked";
import withCurrentUserAuth from "@/lib/withCurrentUserAuth";

type Params = {
    params: Promise<{
        userId: string;
    }>;
}

export default async function BlockedUsersPage({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    await withCurrentUserAuth(userId);
    return (
        <Blocked />
    );
}