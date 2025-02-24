import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

const getChats = async () => {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    } else {
        session = await getSession();
    }
    const res = await fetch('http://localhost:8000/api/chats', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session?.accessToken ? `Bearer ${session.accessToken}` : "",
        },
    });
    return res.json();
}

export default getChats;