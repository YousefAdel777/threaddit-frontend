import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import getMembers from "./getMembers";

const withModeratorAuth = async (communityId: number) => {
    const session = await auth();
    if (!session?.userId) {
        redirect("/signin");
    }
    const members = await getMembers(communityId, Number(session.userId));
    if (!members[0]?.is_moderator) {
        redirect("/");
    }
    return members[0];
} 

export default withModeratorAuth;