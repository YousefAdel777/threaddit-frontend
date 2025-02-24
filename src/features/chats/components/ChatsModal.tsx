"use client"

import Chat from "@/features/chats/components/Chat";
import Loading from "@/features/common/components/Loading";
import { BiChevronLeft, BiChevronUp, BiX } from "react-icons/bi";
import ChatModal from "@/features/chats/components/ChatModal";
import { useChatsStore } from "@/stores/chatsStore";
import useSWR from "swr";

const ChatsModal = () => {

    const { isChatsExpanded, userId, isChatsOpen, setIsChatsOpen, setIsChatsExpanded, setUserId } = useChatsStore();
    const { data: chats, error, isLoading } = useSWR("/api/chats", {
        onSuccess: (data) => {
            return data.sort((a: Chat, b: Chat) => {
                const bChatLastUpdate = b.last_message?.created_at || b.created_at;
                const aChatLastUpdate = a.last_message?.created_at || a.created_at;
                return new Date(bChatLastUpdate).getTime() - new Date(aChatLastUpdate).getTime();
            });
        },
    });

    if (!isChatsOpen) return null;

    const modalContent = (
        <div className="flex pt-4 justify-center w-full max-h-80 overflow-y-auto">
            {
                isLoading ?
                <Loading text="Loading Chats..." />
                :
                error ?
                <h2 className="text-xl w-full text-center font-semibold">Something went wrong.</h2>
                :
                !chats || chats?.length === 0 ?
                <h2 className="text-xl w-full text-center font-semibold">No Chats Yet.</h2>
                :
                <div className="divide-y-[1px] divide-secondary w-full">
                    {
                        chats?.map((chat: Chat) => {
                            return (
                                <Chat key={chat.id} {...chat} />
                            )
                        })
                    }
                </div>
            }
        </div>
    );
    
    return (
        <div className={`fixed z-50 left-24 w-[22rem] h-96 bg-white border-2 border-secondary rounded-t-xl shadow-lg duration-200 ${isChatsExpanded ? "translate-y-0 bottom-0" : "translate-y-full bottom-14"}`}>
            <div className="flex h-14 items-center gap-2 px-4 py-2 shadow-md border-b-[1px] border-secondary">
                {
                    !userId ?
                    <button onClick={() => setIsChatsOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center duration-200 hover:bg-secondary">
                        <BiX className="text-3xl text-primary" />
                    </button>
                    :
                    <button 
                        onClick={() => setUserId(null)}
                        className="w-10 h-10 rounded-full flex items-center justify-center duration-200 hover:bg-secondary">
                        <BiChevronLeft className="text-3xl text-primary" />
                    </button>
                }
                <button onClick={() => setIsChatsExpanded(!isChatsExpanded)} className="w-10 h-10 rounded-full flex items-center justify-center duration-200 hover:bg-secondary">
                    <BiChevronUp className={`text-3xl text-primary duration-200 ${isChatsExpanded ? "rotate-180" : ""}`} />
                </button>
                <h1 className="text-xl ml-auto font-semibold">Chats</h1>
            </div>
            {userId ? <ChatModal chats={chats} /> : modalContent}
        </div>
    );
}

export default ChatsModal;