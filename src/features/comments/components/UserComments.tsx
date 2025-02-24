"use client"

import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import UserComment from "./UserComment";
import Loading from "@/features/common/components/Loading";
import getUserComments from "@/lib/getUserComments";
import Button from "@/features/common/components/Button";
import Select, { SingleValue } from "react-select";

const PAGE_SIZE = 10;

const orderingOption = [
    { label: "Newest", value: "-created_at" },
    { label: "Oldest", value: "created_at" },
    { label: "Top", value: "-interaction_diff" },
    { label: "Controversial", value: "interaction_diff" },
]

export default function UserComments({ userId }: { userId: number }) {
    const [ordering, setOrdering] = useState("-created_at");
    const { data: commentsResponse, isLoading: isLoadingcomments, mutate: mutateComments, size: commentsSize, setSize: setcommentsLimit, error } = useSWRInfinite((index) => ['/api/comments', index, ordering, userId], ([, index]) => getUserComments(userId, ordering, PAGE_SIZE, index + 1));
    const comments = commentsResponse ? [].concat(...commentsResponse) : []
    const isLoadingMoreComments = isLoadingcomments || (commentsSize > 0 && commentsResponse && typeof commentsResponse[commentsSize - 1] === "undefined");
    const isEmpty = commentsResponse?.[0]?.length === 0;
    const isReachingEndComments = isEmpty || (commentsResponse && commentsResponse[commentsResponse.length - 1]?.length < PAGE_SIZE) || (error && comments.length !== 0);

    if (error && comments.length === 0) {
        return (
            <div className="my-5">
                <h2 className="text-lg text-center font-semibold">Something went wrong.</h2>
            </div>
        )
    }

    return (
        <div>
            {
                comments?.length === 0 && !isLoadingMoreComments && !error ?
                <div className="my-5">
                    <h2 className="text-lg text-center font-semibold">No comments Yet.</h2>
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
                        isSearchable={false}
                        className="w-52 mb-4 z-40"
                    />
                    <div>
                        <>
                            {
                                comments?.length === 0 && !isLoadingcomments ?
                                <div className="my-5">
                                    <h2 className="text-lg text-center font-semibold">No Upvoted comments.</h2>
                                </div>
                                :
                                <div className="divide-y-[1px] divide-secondary">
                                    {
                                        comments?.map((comment: CommentType) => (
                                            <UserComment key={comment.id} comments={comments} mutate={mutateComments} {...comment} />
                                        ))
                                    }
                                </div>
                            }
                            {
                                isLoadingMoreComments && !isReachingEndComments &&
                                <div className="my-5">
                                    <Loading text="Loading comments..." />
                                </div>
                            }
                        </>
                            {
                                !isLoadingMoreComments && !isReachingEndComments &&
                                <Button className="my-5 mx-auto block" onClick={() => setcommentsLimit(commentsSize + 1)}>
                                    Show More comments
                                </Button>
                            }
                    </div>
                </div>
            }
        </div>
    )
}