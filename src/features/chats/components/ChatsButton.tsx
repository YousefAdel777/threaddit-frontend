"use client"

import { useEffect, useMemo } from "react";
import { BiChat } from "react-icons/bi";
import { useChatsStore } from "@/stores/chatsStore";
import useSWRSubscription  from "swr/subscription";
import { useSession } from "next-auth/react";
import { mutate } from "swr";


const ChatsButton = ({ initialData }: { initialData: Chat[] }) => {

    const { setIsChatsExpanded, setIsChatsOpen } = useChatsStore();
    const { data: session } = useSession();
    const chatsKey = session?.accessToken ? `ws://localhost:8000/ws/chats/?token=${session.accessToken}` : null;
    const { data: chats, error } = useSWRSubscription(chatsKey, (key, { next }) => {
        const ws = new WebSocket(key);
        ws.addEventListener("message", (event: MessageEvent) => {
            if (event.type === "send_message") {
                next(null, event.data);
            }
        });

        return () => ws.close();
    }, {
        fallbackData: initialData,
    });

    useEffect(() => {
        mutate(chatsKey, initialData, false);
    }, [initialData, chatsKey]);

    const unreadMessagesCount = useMemo(() => chats?.filter((chat: Chat) => chat.unread_messages_count > 0).length, [chats]);

    if (error) {
        console.log(error);
    }

    return (
        <div>
            <button 
                onClick={() => {
                    setIsChatsOpen(true);
                    setIsChatsExpanded(true);
                }}
                className="rounded-full relative text-gray-500 flex items-center justify-center hover:bg-secondary duration-200 w-10 h-10"
            >
                {
                    unreadMessagesCount > 0 &&
                    <span className="font-semibold bg-red-600 text-white text-sm w-4 h-4 rounded-full absolute right-1 top-1 flex items-center justify-center">
                        {unreadMessagesCount}
                    </span>
                }
                <BiChat className="text-2xl" />
            </button>
        </div>
    );
}

export default ChatsButton;