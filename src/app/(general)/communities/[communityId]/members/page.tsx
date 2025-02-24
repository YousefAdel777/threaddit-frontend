import Members from "@/features/communities/components/Members";
import withModeratorAuth from "@/lib/withModeratorAuth";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export default async function MembersPage({ params }: Params) {
    const communityId = Number.parseInt((await params).communityId);
    const member = await withModeratorAuth(communityId);
    return (
        <Members currentMember={member} communityId={communityId} />
    );
}