"use client"

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import UserPost from "@/features/posts/components/UserPost";
import Loading from "@/features/common/components/Loading";
import getPaginatedPosts from "@/lib/getPaginatedPosts";
import Button from "@/features/common/components/Button";
import Select, { SingleValue } from "react-select";

const PAGE_SIZE = 10;

const orderingOption = [
    { label: "Relevance", value: "" },
    { label: "Newest", value: "-created_at" },
    { label: "Oldest", value: "created_at" },
    { label: "Top", value: "-interaction_diff" },
    { label: "Controversial", value: "interaction_diff" },
]

export default function SearchPosts({ query }: { query: string }) {
    const [ordering, setOrdering] = useState("");
    const { data: postsResponse, isLoading: isLoadingPosts, mutate: mutatePosts, size: postsSize, setSize: setPostsLimit, error } = useSWRInfinite((index) => ['/api/posts', index, ordering, query], ([, index]) => getPaginatedPosts(query, ordering, index + 1, PAGE_SIZE));
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
        <div>
            {
                posts?.length === 0 && !isLoadingMorePosts && !error ?
                <div className="my-5">
                    <h2 className="text-lg text-center font-semibold">No Posts Found.</h2>
                </div>
                :
                <div>
                    <Select instanceId="ract-select"
                        onChange={(val: SingleValue<{ label: string, value: string }>) => {
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
                                    <div key={post.id}>
                                        <UserPost data={postsResponse || []} mutate={mutatePosts} {...post} />
                                    </div>
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