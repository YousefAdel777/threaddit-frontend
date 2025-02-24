"use client"
import useSWRInfinite from "swr/infinite";
import Loading from "@/features/common/components/Loading";
import Button from "@/features/common/components/Button";
import BlockedUser from "./BlockedUser";
import getBlockedUsers from "@/lib/getBlockedUsers";

const PAGE_SIZE = 20;

const Blocked = () => {
    const { data: usersResponse, isLoading: isLoadingUsers, mutate: mutateUsers, size: usersSize, setSize: setUsersLimit, error } = useSWRInfinite((index) => ['/api/blocked-users', index], ([, index]) => getBlockedUsers(PAGE_SIZE, index + 1));
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
            <>
                {
                    users?.length === 0 && !isLoadingUsers ?
                    <h2 className="text-lg text-center my-5 font-semibold">No Blocked Users.</h2>
                    :
                    <div className="divide-x-[1px] divide-secondary">
                        {
                            users?.map((user: BlockedUser) => (
                                <BlockedUser users={users} mutate={mutateUsers} key={user.id} {...user} />
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
    )
}

export default Blocked;