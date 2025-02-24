import UserComments from "@/features/comments/components/UserComments";

type Params = {
    params: Promise<{
        userId: string
    }>
}


export default async function CommentsPage({ params }: Params) {
    const userId = Number.parseInt((await params).userId);
    return (
        <UserComments userId={userId} />
    );
}