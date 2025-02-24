import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

export default async function getCommunities(search?: string, page?: number, perPage?: number) {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    }
    else {
        session = await getSession();
    }
    const res = await fetch(`http://localhost:8000/api/communities?search=${search || ""}&page=${page || ""}&per_page=${perPage || ""}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": session?.accessToken ? `Bearer ${session.accessToken}` : "",
        },
    });
    return res.json();
    // const res = await axios.get(`/api/communities?search=${search || ""}&page=${page || ""}&per_page=${perPage || ""}`);
    // return res.data;
}