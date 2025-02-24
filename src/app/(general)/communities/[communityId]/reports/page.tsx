import Reports from "@/features/reports/components/Reports";
import withModeratorAuth from "@/lib/withModeratorAuth";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export default async function ReportsPage({ params }: Params) {
    const communityId = Number.parseInt((await params).communityId);
    await withModeratorAuth(communityId);
    return (
        <Reports communityId={communityId} />
    )
}