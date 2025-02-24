import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const withCurrentUserAuth = async (userId: number) => {
    const session = await auth();
    if (session?.userId !== String(userId)) {
        redirect("/");
    }
} 

export default withCurrentUserAuth;