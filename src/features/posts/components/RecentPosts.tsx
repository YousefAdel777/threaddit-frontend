"use client"

import Link from "next/link";
import Image from "next/image";
import { useRecentPostsStore } from "@/stores/recentPostsStore";
import { useRouter } from "next/navigation";

const RecentPosts = () => {
    const { recentPosts, clearPosts } = useRecentPostsStore();
    const router = useRouter();
    if (recentPosts.length === 0) {
        return null;
    }
    return (
        <div className="w-1/3 max-h-64 overflow-y-auto sticky top-20 rounded-xl border-2 border-secondary">
            <div className="flex p-3 justify-between items-center">
                <h2 className="text-lg font-bold">Recent Posts</h2>
                <button className="text-sm text-primary hover:underline" onClick={clearPosts}>Clear</button>
            </div>
            <div className="divide-y-[1px] divide-secondary">
                {
                    recentPosts.map(post => {
                        return (
                            <div key={post.id} className="py-2">
                                <div className="duration-200 block cursor-pointer hover:bg-secondary p-4" onClick={() => router.push(`/posts/${post.id}`)}>
                                    <Link href={`${post.community ? `/communities/${post.community.id}` : `users/${post.user.id}`}`} className="flex items-center gap-3 mb-2">
                                        <Image className="rounded-full" width={40} height={40} src={post.community ? post.community.icon || "/images/community_image.webp" : post.user.image || "/images/user_image.webp"} alt={`${post.community ? post.community.name : post.user.username} image`} />
                                        <span className="font-semibold hover:underline text-lg">{post.community ? `t/${post.community.name}` : `${post.user.username}`}</span>
                                    </Link>
                                    <h2 className="text-xl font-bold">{post.title}</h2>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RecentPosts;