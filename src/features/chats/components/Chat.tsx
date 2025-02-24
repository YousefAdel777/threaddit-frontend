"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useChatsStore } from "@/stores/chatsStore";

type Props = {
    id: number;
    other_participant: User | null;
    last_message: Message | null;
    unread_messages_count: number;
}

const Chat = ({ other_participant, last_message, unread_messages_count }: Props) => {
    const { data: session } = useSession();
    const { setUserId } = useChatsStore();

    return (
        <div onClick={() => setUserId(other_participant?.id || null)} className="flex items-center gap-3 px-2 py-3 cursor-pointer duration-200 hover:bg-secondary">
            <Link href={`/users/${other_participant?.id}`}>
                <Image src={other_participant?.image || "/images/user_image.webp"} alt={`${other_participant?.username} profile image`} width={50} height={50} className="rounded-full" priority={true} />
            </Link>
            <div>
                {
                    last_message &&
                    <p className="text-xs">
                        {formatDate(last_message.created_at)}
                    </p>
                }
                <Link href={`/users/${other_participant?.id || ""}`} className="font-semibold mb-2 text-sm hover:underline">
                    u/{other_participant?.username || "user_not_found"}
                </Link>
                <p className="text-xs max-w-[35ch] truncate">
                    {last_message?.user.id === Number(session?.userId) ? "You: " : `u/${last_message?.user.username}: `}
                    {last_message?.content}
                </p>
            </div>
            {
                unread_messages_count > 0 &&
                <span className="w-6 h-6 ml-auto text-white text-xs font-semibold rounded-full bg-primary flex items-center justify-center">
                    {unread_messages_count}
                </span>
            }
        </div>
    );
}

export default Chat;