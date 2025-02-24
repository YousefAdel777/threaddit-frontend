import getCommunity from "@/lib/getCommunity";
import type { Metadata } from "next";
import CommunityPosts from "@/features/communities/components/CommunityPosts";
import getCommunityPosts from "@/lib/getCommunityPosts";

type Params = {
    params: Promise<{
        communityId: string;
    }>
}

export const revalidate = 60;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const communityId = Number.parseInt((await params).communityId);
    const community: Community = await getCommunity(communityId);
    return {
        title: `Community - ${community.name || "Not found"}`,
        description: community.description || "Not found",
    };
}

export default async function Community({ params } : Params) {
    const communityId = Number.parseInt((await params).communityId);
    const posts = await getCommunityPosts(communityId);
    return (
        <CommunityPosts initialPosts={posts} communityId={Number.parseInt((await params).communityId)} />
    );
}


export async function generateStaticParams() {
    const res = await fetch("http://localhost:8000/api/communities");
    const communities: Community[] = await res.json();
    return communities.map((community) => ({
        communityId: community.id.toString(),
    }));
}