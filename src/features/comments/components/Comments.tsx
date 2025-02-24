"use client";

import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import Select, { SingleValue } from "react-select";
import useSWRInfinite from "swr/infinite";
import getPostComments from "@/lib/getPostComments";
import Loading from "@/features/common/components/Loading";
import Button from "@/features/common/components/Button";
import { useState } from "react";

type Props = {
    postId: number;
}

const orderingOptions = [
    { value: "-interaction_diff", label: "Top" },
    { value: "interaction_diff", label: "Controversial" },
    { value: "-created_at", label: "Newest" },
    { value: "created_at", label: "Oldest" },
]

const PAGE_SIZE = 20;

export default function Comments({ postId }: Props) {
    const [ordering, setOrdering] = useState("-interaction_diff");
    const { data: commentsResponse, isLoading: isLoadingComments, mutate: mutateComments, size: commentsSize, setSize: setCommentsLimit, error } = useSWRInfinite((index) => ['/api/comments', index, ordering], ([, index]) => getPostComments(postId, ordering, PAGE_SIZE, index + 1));
    const comments = commentsResponse ? [].concat(...commentsResponse) : []
    const isLoadingMoreComments = isLoadingComments || (commentsSize > 0 && commentsResponse && typeof commentsResponse[commentsSize - 1] === "undefined");
    const isEmpty = commentsResponse?.[0]?.length === 0;
    const isReachingEndComments = isEmpty || (commentsResponse && commentsResponse[commentsResponse.length - 1]?.length < PAGE_SIZE) || (error && comments.length !== 0);

    return (
        <div className="mt-6 px-4">
            <CommentForm mutate={mutateComments} comments={comments} postId={postId} />
            {
                comments?.length === 0 && !isLoadingMoreComments && !error ?
                <h2 className="text-lg my-5 text-center font-semibold">No Comments Yet.</h2>
                :
                <div>
                    <Select 
                        instanceId="react-select"
                        onChange={(val: SingleValue<Option<string>>) => {
                            if (val) {
                                setOrdering(val.value);
                            }
                        }}
                        value={orderingOptions.find((option) => option.value === ordering)}
                        options={orderingOptions}
                        className="w-52 mb-4 z-40"
                    />
                    <div>
                        <>
                            <div className=" space-y-3">
                                {comments.map((comment: CommentType) => (
                                    <CommentCard comments={comments} mutate={mutateComments} key={comment.id} {...comment} />
                                ))}
                            </div>
                            {
                                isLoadingMoreComments && !isReachingEndComments &&
                                <div className="my-5">
                                    <Loading text="Loading comments..." />
                                </div>
                            }
                        </>
                            {
                                !isLoadingMoreComments && !isReachingEndComments &&
                                <Button className="my-5 mx-auto block" onClick={() => setCommentsLimit(commentsSize + 1)}>
                                    Show More Comments
                                </Button>
                            }
                    </div>
                </div>
            }
        </div>
    );
}