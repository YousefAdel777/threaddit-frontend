import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

const getTokens = async () => {
    const session = typeof window === "undefined" ? await auth() : await getSession();
    if (!session) {
        redirect("/signin");
    }
    return { accessToken: session?.accessToken, refreshToken: session?.refreshToken };
}

export default getTokens;