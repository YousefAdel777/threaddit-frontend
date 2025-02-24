"use client"

import useSWRInfinite from "swr/infinite";
import Loading from "@/features/common/components/Loading";
import getPaginatedCommunities from "@/lib/getPaginatedCommunities";
import Button from "@/features/common/components/Button";
import CommunityCard from "./CommunityCard";

const PAGE_SIZE = 6;

type Props = {
    id: number;
    name: string;
}

export default function UserCommunities({ id, name }: Props) {

    const { data: communitiesResponse, isLoading: isLoadingCommunities, size: communitiesSize, setSize: setCommunitiesLimit, error } = useSWRInfinite((index) => ['/api/communities', index, id], ([, index]) => getPaginatedCommunities(undefined, index + 1, PAGE_SIZE, id));
    const communities = communitiesResponse ? [].concat(...communitiesResponse) : []
    const isLoadingMoreCommunities = isLoadingCommunities || (communitiesSize > 0 && communitiesResponse && typeof communitiesResponse[communitiesSize - 1] === "undefined");
    const isEmpty = communitiesResponse?.[0]?.length === 0;
    const isReachingEndCommunities = isEmpty || (communitiesResponse && communitiesResponse[communitiesResponse.length - 1]?.length < PAGE_SIZE) || (error && communities.length !== 0);

    if (error && communities.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        )
    }

    return (
        <div>
            <h2 className="font-bold text-2xl capitalize mb-3">{name}</h2>
            {
                communities?.length === 0 && !isLoadingMoreCommunities && !error ?
                <h2 className="text-lg my-5 text-center font-semibold">No Communities Found.</h2>
                :
                <div>
                    <div>
                        <>
                            {
                                communities?.length === 0 && !isLoadingCommunities ?
                                <div className="my-5">
                                    <h2 className="text-lg text-center font-semibold">No Communities.</h2>
                                </div>
                                :
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    {
                                        communities.map((community: Community) => (
                                            <CommunityCard key={community.id} {...community} />
                                        ))
                                    }
                                </div>
                            }
                            {
                                isLoadingMoreCommunities && !isReachingEndCommunities &&
                                <div className="my-5">
                                    <Loading text="Loading communities..." />
                                </div>
                            }
                        </>
                            {
                                !isLoadingMoreCommunities && !isReachingEndCommunities &&
                                <Button className="my-5 mx-auto block" onClick={() => setCommunitiesLimit(communitiesSize + 1)}>
                                    Show More Communities
                                </Button>
                            }
                    </div>
                </div>
            }
        </div>
    )
}