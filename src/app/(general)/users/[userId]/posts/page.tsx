import UserPosts from "@/features/posts/components/UserPosts";

type Params = {
    params: Promise<{
        userId: string
    }>
}
export default async function Posts({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    return (
        <UserPosts userId={userId} />
    )
}