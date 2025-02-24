"use client"
import useSWRInfinite from "swr/infinite";
import UserPost from "@/features/posts/components/UserPost";
import Loading from "@/features/common/components/Loading";
import Button from "@/features/common/components/Button";
import getUserDownvotedPosts from "@/lib/getUserDownvotedPosts";

const PAGE_SIZE = 20;

export default function DownvotedPosts() {
    const { data: postsResponse, isLoading: isLoadingPosts, mutate: mutatePosts, size: postsSize, setSize: setPostsLimit, error } = useSWRInfinite((index) => ['/api/downvoted-posts', index], ([, index]) => getUserDownvotedPosts(PAGE_SIZE, index + 1));
    const posts = postsResponse ? [].concat(...postsResponse) : []
    const isLoadingMorePosts = isLoadingPosts || (postsSize > 0 && postsResponse && typeof postsResponse[postsSize - 1] === "undefined");
    const isEmpty = postsResponse?.[0]?.length === 0;
    const isReachingEndPosts = isEmpty || (postsResponse && postsResponse[postsResponse.length - 1]?.length < PAGE_SIZE) || (error && posts.length !== 0);

    if (error && posts.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        )
    }

    return (
        <div>
            <>
                {
                    posts?.length === 0 && !isLoadingPosts ?
                    <div className="my-5">
                        <h2 className="text-lg text-center font-semibold">No Downvoted Posts.</h2>
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
    )
}