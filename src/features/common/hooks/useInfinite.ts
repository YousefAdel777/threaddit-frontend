import { useState } from "react";

const usePagination = <T> (url: string, perPage:number = 20, page: number = 0) => {
    const getKey = (pageIndex: number, previousPageData: T[]) => {
        if (previousPageData && !previousPageData.length) return null;
        return `${url}?page=${pageIndex}per_page=${perPage}`;
    };

    const { data, isLoading, mutate, size: postsSize, setSize, error } = useSWRInfinite<Post[]>((index) => ['/api/upvoted-posts', index], ([, index]) => getUserUpvotedPosts(PAGE_SIZE, index + 1));
    const posts = postsResponse ? [].concat(...postsResponse) : []
    const isLoadingMorePosts = isLoadingPosts || (postsSize > 0 && postsResponse && typeof postsResponse[postsSize - 1] === "undefined");
    const isEmpty = postsResponse?.[0]?.length === 0;
    const isReachingEndPosts = isEmpty || (postsResponse && postsResponse[postsResponse.length - 1]?.length < PAGE_SIZE) || (error && posts.length !== 0);


    return {
        data,
        isLoading,
        mutate,
    }
}

export default usePagination;