import getCommunities from "@/lib/getCommunities";
import getUsers from "@/lib/getUsers";
import useSWR from "swr";
import Loading from "@/features/common/components/Loading";
import Link from "next/link";
import { FaMagnifyingGlass } from "react-icons/fa6";
import CommunitySearchResult from "./CommunitySearchResult";
import UserSearchResult from "./UserSearchResult";

type Props = {
    query?: string;
}

const PAGE_SIZE = 2;

export default function SearchResults({ query }: Props) {
    const { data: usersResponse, isLoading: isLoadingUsers, error: usersError } = useSWR(["/api/users", query, PAGE_SIZE], () => getUsers(query, 1, PAGE_SIZE));
    const { data: communitiesResponse, isLoading: isLoadingCommunities, error: communitiesError } = useSWR(query ? ["/api/communities",  query, PAGE_SIZE] : null, () => getCommunities(query, 1, PAGE_SIZE));
    const users = usersResponse?.results || [];
    const communities = communitiesResponse?.results || [];
    let content;

    if (isLoadingUsers || isLoadingCommunities) {
        content = (
            <Loading text="Searching Threaddit..." />
        )
    }
    else if (usersError || communitiesError) {
        content = (
            <h2 className="text-lg font-semibold">Something went wrong</h2>
        )
    }
    else {
        content = (
            <>
                {
                    communities.length > 0 &&
                    <div className="py-3">
                        <h3 className="font-semibold text-sm mb-1">Communities</h3>
                        <div>
                            {
                                communities.map((community: Community) => (
                                    <CommunitySearchResult key={community.id} {...community} />
                                ))
                            }
                        </div>
                    </div>
                }
                {
                    users.length > 0 &&
                    <div className="py-3">
                        <h3 className="font-semibold text-sm mb-1">Users</h3>
                        {
                            users.map((user: User) => {
                                return (
                                    <UserSearchResult key={user.id} {...user} />
                                )
                            })
                        }
                    </div>
                }
                <Link className="flex items-center gap-3 py-3 text-primary test-sm" href={`/search?q=${query}`}>
                    <FaMagnifyingGlass className="text-base" />
                    <span className="text-sm text-primary">{`Search for "${query}"`}</span>
                </Link>
            </>
        )
    }

    return (
        <div onMouseDown={(e) => e.preventDefault()} className="shadow-lg bg-white divide-y-2 divide-secondary rounded-xl p-3">
            {content}
        </div>
    )
}