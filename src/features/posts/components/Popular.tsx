"use client"
import useSWRInfinite from "swr/infinite";
import UserPost from "@/features/posts/components/UserPost";
import Loading from "@/features/common/components/Loading";
import getFeed from "@/lib/getFeed";
import InfiniteScroll from "react-infinite-scroll-component"

const PAGE_SIZE = 20;

const Popular = () => {
    const { data: postsResponse, mutate: mutatePosts, isLoading: isLoadingPosts, size: postsSize, setSize: setPostsLimit, error } = useSWRInfinite((index) => ['/api/downvoted-posts', index], ([, index]) => getFeed(PAGE_SIZE, index + 1));
    const posts = postsResponse ? [].concat(...postsResponse) : []
    const isEmpty = postsResponse?.[0]?.length === 0;
    const isReachingEndPosts = isEmpty || (postsResponse && postsResponse[postsResponse.length - 1]?.length < PAGE_SIZE) || (error && posts.length !== 0);

    if (error && posts.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        );
    }

    return (
        <div className="flex-1">
            {
                posts.length === 0 && !isLoadingPosts ?
                <h2 className="text-lg my-5 text-center font-semibold">No Recent Posts.</h2>
                :
                null
            }
            <InfiniteScroll
                dataLength={posts.length}
                next={() => setPostsLimit(postsSize + 1)}
                hasMore={!isReachingEndPosts}
                loader={<Loading text="Loading posts..." />}
            >
                {
                    posts?.map((post: Post) => (
                        <UserPost key={post.id} data={postsResponse || []} mutate={mutatePosts} {...post} />
                    ))
                }
            </InfiniteScroll>
        </div>
    )
}

export default Popular;