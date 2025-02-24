"use client"
import { useState } from "react";
import useDebounce from "@/features/common/hooks/useDebounce";
import useSWR from "swr";
import getMembers from "@/lib/getMembers";
import Loading from "@/features/common/components/Loading";
import Member from "./Member";

type Props = {
    communityId: number;
    currentMember: Member;
}

export default function Members({ communityId, currentMember }: Props) {
    const [search, setSearch] = useState("");
    const { debouncedValue: debouncedSearch } = useDebounce(search, 500);
    const { data: members, isLoading, error, mutate } = useSWR(["/api/members", communityId, debouncedSearch], () => getMembers(communityId, debouncedSearch, undefined));

    if (error) {
        return (
            <div className="pt-4 mt-4 border-t-[1px] border-secondary">
                <h2 className="text-center font-semibold text-lg">Something went wrong.</h2>
            </div>
        )
    }

    return (
        <div className="pt-4 mt-4 border-t-[1px] border-secondary">
            <h1 className="text-xl mb-4 font-bold">Community Members</h1>
            <div className="mb-4">
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-input"
                    placeholder="Search Members..."
                />
            </div>
            {
                !isLoading && members?.length === 0 ?
                <h2 className="text-center text-lg font-semibold">
                    No Members Found.
                </h2>
                :
                <div className="divide-y-[1px] divide-secondary">
                    {
                        members?.map((member: Member) => {
                            return <Member communityId={communityId} currentMember={currentMember} members={members} mutate={mutate} key={member.id} {...member} />
                        })
                    }
                </div>
            }
            {
                isLoading && !error &&
                <Loading text="Loading Members..." />
            }
        </div>
    );
}