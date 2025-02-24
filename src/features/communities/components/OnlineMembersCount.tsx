"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const OnlineMembersCount = ({ communityId }: { communityId: number }) => {
    const [onlineMembersCount, setOnlineMembersCount] = useState(0);
    const { data: session } = useSession();
    useEffect(() => {
        if (session?.accessToken) {
            const ws = new WebSocket(`ws://localhost:8000/ws/community/${communityId}/?token=${session?.accessToken || ""}`);
            ws.onmessage = (event: MessageEvent) => {
                setOnlineMembersCount(JSON.parse(event.data).online_members_count);
            }
            return () => ws.close();
        }
    }, [communityId, session?.accessToken]);
    return (
        <h3 className="text-lg font-bold">
            {onlineMembersCount}
        </h3>
    )
}

export default OnlineMembersCount;