"use client"
import useSWRInfinite from "swr/infinite";
import UserPost from "./UserPost";
import Loading from "@/features/common/components/Loading";
import getUserUpvotedPosts from "@/lib/getUserUpvotedPosts";
import Button from "@/features/common/components/Button";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 10;


export default function UpvotedPosts() {
    const { data: postsResponse, isLoading: isLoadingPosts, mutate: mutatePosts, size: postsSize, setSize: setPostsLimit, error } = useSWRInfinite((index) => ['/api/upvoted-posts', index], ([, index]) => getUserUpvotedPosts(PAGE_SIZE, index + 1));
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
        <section>
            <InfiniteScroll
                next={() => setPostsLimit(postsSize + 1)}
                loader={<Loading text="Loading Posts..." />}
                hasMore={true}
                dataLength={posts.length}
            >
                {
                    posts?.map((post: Post) => (
                        <UserPost key={post.id} data={postsResponse || []} mutate={mutatePosts} {...post} />
                    ))
                }
            </InfiniteScroll>
            <div>
                <>
                    {
                        posts?.length === 0 && !isLoadingPosts ?
                        <div className="my-5">
                            <h2 className="text-lg text-center font-semibold">No Upvoted Posts.</h2>
                        </div>
                        :
                        posts?.map((post: Post) => (
                            <UserPost key={post.id} data={postsResponse || []} mutate={mutatePosts} {...post} />
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
        </section>
    )
}