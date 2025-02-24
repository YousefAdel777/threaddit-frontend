"use client"

import useSWRInfinite from "swr/infinite";
import Loading from "@/features/common/components/Loading";
import getPaginatedUsers from "@/lib/getPaginatedUsers";
import Button from "@/features/common/components/Button";
import User from "@/features/users/components/User";

const PAGE_SIZE = 20;

export default function SearchUsers({ query }: { query: string }) {
    const { data: usersResponse, isLoading: isLoadingUsers, size: usersSize, setSize: setUsersLimit, error } = useSWRInfinite((index) => ['/api/users', index, query], ([, index]) => getPaginatedUsers(query, undefined, index + 1, PAGE_SIZE));
    const users = usersResponse ? [].concat(...usersResponse) : []
    const isLoadingMoreUsers = isLoadingUsers || (usersSize > 0 && usersResponse && typeof usersResponse[usersSize - 1] === "undefined");
    const isEmpty = usersResponse?.[0]?.length === 0;
    const isReachingEndUsers = isEmpty || (usersResponse && usersResponse[usersResponse.length - 1]?.length < PAGE_SIZE) || (error && users.length !== 0);
    
    if (error && users.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        )
    }

    return (
        <div>
            {
                users?.length === 0 && !isLoadingMoreUsers && !error ?
                <div className="my-5">
                    <h2 className="text-lg text-center font-semibold">No Users Found.</h2>
                </div>
                :
                <div>
                    <>
                        {
                            users?.length === 0 && !isLoadingUsers ?
                            <div className="my-5">
                                <h2 className="text-lg text-center font-semibold">No Upvoted Users.</h2>
                            </div>
                            :
                            <div className="divide-y-[1px] divide-secondary">
                                {
                                    users?.map((user: User) => (
                                        <User key={user.id} {...user} />
                                    ))
                                }
                            </div>
                        }
                        {
                            isLoadingMoreUsers && !isReachingEndUsers &&
                            <div className="my-5">
                                <Loading text="Loading users..." />
                            </div>
                        }
                    </>
                        {
                            !isLoadingMoreUsers && !isReachingEndUsers &&
                            <Button className="my-5 mx-auto block" onClick={() => setUsersLimit(usersSize + 1)}>
                                Show More Users
                            </Button>
                        }
                </div>
            }
        </div>
    )
}