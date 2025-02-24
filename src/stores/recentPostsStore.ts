import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    recentPosts: RecentPost[];
    addPost: (post: RecentPost) => void;
    clearPosts: () => void;
}

export const useRecentPostsStore = create<State>()(persist((set) => ({
    recentPosts: [],
    addPost: (newPost: RecentPost) => set((state) => {
        let recentPosts = state.recentPosts.filter((post) => newPost.id !== post.id);
        recentPosts = [newPost, ...recentPosts];
        if (recentPosts.length > 10) { 
            recentPosts = recentPosts.slice(0, 10);
        }
        return { recentPosts };
    }),
    clearPosts: () => set({ recentPosts: [] }),
}), { name: "recentPosts" }));