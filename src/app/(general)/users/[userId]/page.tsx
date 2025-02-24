import type { Metadata } from "next"
import getUser from "@/lib/getUser";
import UserPosts from "@/features/posts/components/UserPosts";
import fetcher from "@/lib/fetcher";
import { BASE_URL } from "@/lib/apiAxios";

type Params = {
    params: Promise<{
        userId: string;
    }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const userId = Number.parseInt((await params).userId);
    const user = await getUser(userId);
    if (!user.id) {
        return {
            title: "User not found",
            description: ""
        }
    }

    return {
        title: `u/${user.username}`,
        description: `${user.bio}`,
    }
}

export default async function User({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    return (
        <UserPosts userId={userId} />
    )
}

export async function generateStaticParams() {
    const users: User[] = await fetch(`${BASE_URL}/api/users`).then(res => res.json());    
    return users?.map(user => ({ userId: user.id.toString() }));
    // const users: User[] = await fetcher(`/api/users`);
    // return users?.map(user => ({ userId: user.id.toString() }));
}