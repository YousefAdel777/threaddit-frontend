import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fetcher = async (url: string) => {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    }
    else {
        session = await getSession();
    }
    const res = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": session?.accessToken ? `Bearer ${session.accessToken}` : "",
        }
    });

    return await res.json();
}

export default fetcher;