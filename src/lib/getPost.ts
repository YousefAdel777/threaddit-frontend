import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

export default async function getPost(postId: number) {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    }
    else {
        session = await getSession();
    }
    const res = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: "GET",
        headers: {
            "Authorization": `${session?.accessToken ? `Bearer ${session.accessToken}` : ""}`,
        }
    });
    return res.json();
}