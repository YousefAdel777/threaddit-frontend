"use client"

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import CommunityPost from "@/features/posts/components/CommunityPost";
import Loading from "@/features/common/components/Loading";
import Button from "@/features/common/components/Button";
import Select, { SingleValue } from "react-select";
import getCommunityPosts from "@/lib/getCommunityPosts";

type Props = {
    communityId: number;
    initialPosts: Post[];
}

const PAGE_SIZE = 10;

const orderingOption = [
    { label: "Newest", value: "-created_at" },
    { label: "Oldest", value: "created_at" },
    { label: "Top", value: "-interaction_diff" },
    { label: "Controversial", value: "interaction_diff" }
]

export default function CommunityPosts({ communityId, initialPosts }: Props) {
    const [ordering, setOrdering] = useState("-created_at");
    const { data: postsResponse, isLoading: isLoadingPosts, mutate: mutatePosts, size: postsSize, setSize: setPostsLimit, error } = useSWRInfinite<Post[]>((index) => ['/api/posts', index, ordering, communityId, 'accepted'], ([, index]) => getCommunityPosts(communityId, 'accepted', ordering, PAGE_SIZE, index + 1));
    const posts = postsResponse ? [].concat(...postsResponse) : []
    const isLoadingMorePosts = isLoadingPosts || (postsSize > 0 && postsResponse && typeof postsResponse[postsSize - 1] === "undefined");
    const isEmpty = postsResponse?.[0]?.length === 0;
    const isReachingEndPosts = isEmpty || (postsResponse && postsResponse[postsResponse.length - 1]?.length < PAGE_SIZE) || (error && posts.length !== 0);    

    if (error && posts.length === 0) {
        return (
            <div className="my-5">
                <h2 className="text-lg text-center font-semibold">Something went wrong.</h2>
            </div>
        )
    }

    return (
        <div className="pt-4 mt-4 border-t-[1px] border-secondary">
            {
                posts?.length === 0 && !isLoadingMorePosts && !error ?
                <div className="my-5">
                    <h2 className="text-lg text-center font-semibold">No Posts Yet.</h2>
                </div>
                :
                <div>
                    <Select instanceId="ract-select"
                        onChange={(val: SingleValue<Option<string>>) => {
                            if (val) {
                                setOrdering(val.value);
                            }
                        }}
                        value={orderingOption.find((option) => option.value === ordering)}
                        options={orderingOption}
                        className="w-52 mb-4 z-40"
                        isSearchable={false}
                    />
                    <div>
                        <>
                            {
                                posts?.length === 0 && !isLoadingPosts ?
                                <div className="my-5">
                                    <h2 className="text-lg text-center font-semibold">No Upvoted Posts.</h2>
                                </div>
                                :
                                posts?.map((post: Post) => (
                                    <CommunityPost key={post.id} data={postsResponse || []} mutate={mutatePosts} {...post} />
                                ))
                            }
                            {
                                isLoadingMorePosts && !isReachingEndPosts &&
                                <div className="my-5">
                                    <Loading text="Loading posts..." />
                                </div>
                            }
                        </>
                            {
                                !isLoadingMorePosts && !isReachingEndPosts &&
                                <Button className="my-5 mx-auto block" onClick={() => setPostsLimit(postsSize + 1)}>
                                    Show More Posts
                                </Button>
                            }
                    </div>
                </div>
            }
        </div>
    )
}