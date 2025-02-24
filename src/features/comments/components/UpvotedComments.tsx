
"use client"
import useSWRInfinite from "swr/infinite";
import UserComment from "./UserComment";
import Loading from "@/features/common/components/Loading";
import getUserUpvotedComments from "@/lib/getUserUpvotedComments";
import Button from "@/features/common/components/Button";

const PAGE_SIZE = 10;

export default function UpvotedComments() {
    const { data: commentsResponse, isLoading: isLoadingComments, mutate: mutateComments, size: commentsSize, setSize: setCommentsLimit, error } = useSWRInfinite((index) => ['/api/upvoted-comments', index],  ([, index]) => getUserUpvotedComments(PAGE_SIZE, index + 1));
    const comments = commentsResponse ? [].concat(...commentsResponse) : []
    const isLoadingMoreComments = isLoadingComments || (commentsSize > 0 && commentsResponse && typeof commentsResponse[commentsSize - 1] === "undefined");
    const isEmptyComments = commentsResponse?.[0]?.length === 0;
    const isReachingEndComments = isEmptyComments || (commentsResponse && commentsResponse[commentsResponse.length - 1]?.length < PAGE_SIZE) || (error && comments.length !== 0);

    if (error && comments.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        )
    }

    return (
        <div>
            {
                comments?.length === 0 && !isLoadingComments ?
                    <h2 className="text-lg my-5 text-center font-semibold">No Upvoted Comments.</h2>
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
            {
                !isLoadingMoreComments && !isReachingEndComments &&
                <Button className="my-5 mx-auto block" onClick={() => setCommentsLimit(commentsSize + 1)} >
                    Show More Comments
                </Button> 
            }
        </div>
    );
}