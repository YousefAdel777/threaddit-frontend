import CommunityHeader from "@/features/communities/components/CommunityHeader";
import CommunityDetails from "@/features/communities/components/CommunityDetails";
import getCommunity from "@/lib/getCommunity";
import getCommunityMember from "@/lib/getCommunityMember";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import Ban from "@/features/ban/components/Ban";
import { notFound } from "next/navigation";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ communityId: string }> }) {
    const communityId = Number.parseInt((await params).communityId);
    const session = await auth();
    const [community, member] = await Promise.all([
        getCommunity(communityId),
        getCommunityMember(Number(session?.userId) || 0, communityId),
    ]);

    if (!community.id) {
        return notFound();
    }
    
    return (
        // <div className="pt-4 pl-10">
        //     <div className="flex flex-col-reverse items-start gap-2 w-3/4 ml-auto lg:flex-row">
        //         <div className="lg:w-2/3">
        //             <CommunityHeader {...community} />
        //             {children}
        //         </div>
        //         <CommunityDetails {...community} />
        //     </div>
        // </div>
        <div className="pt-4 pl-10">
            <div className="flex flex-col-reverse items-start gap-2 lg:flex-row">
                <div className="lg:w-2/3">
                    <CommunityHeader {...community} />
                    {
                        member?.[0]?.ban_detail?.is_active ?
                        <Ban {...member?.[0]?.ban_detail} />
                        :
                        children
                    }
                </div>
                <CommunityDetails is_moderator={member?.[0]?.is_moderator} community={community} />
            </div>
        </div>
        // <div className="pt-4 pl-10">
        //     <div className="flex flex-col-reverse items-start gap-2 w-3/4 ml-auto lg:flex-row">
        //         <div>
        //             <CommunityHeader {...community} />
        //             <div className="flex items-start">
        //                 {children}
        //                 <CommunityDetails {...community} />
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
}