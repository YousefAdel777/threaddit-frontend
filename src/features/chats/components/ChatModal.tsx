"use client";

import getChatMessages from "@/lib/getChatMessages";
import Loading from "@/features/common/components/Loading";
import ChatMessages from "@/features/chats/components/ChatMessages";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import Button from "@/features/common/components/Button";
import { useChatsStore } from "@/stores/chatsStore";
import UserAvatar from "@/features/users/components/UserAvatar";

const PAGE_SIZE = 20;

type Props = {
    chats: Chat[];
}

const ChatModal = ({ chats }: Props) => {
    const { userId } = useChatsStore();
    const currentChat = chats.find((chat) => chat.other_participant?.id === userId);
    const otherUser = currentChat?.other_participant;
    const { data: messagesResponse, isLoading: isLoadingMessages, size, setSize, error, mutate } = useSWRInfinite((index) => currentChat?.id ? ['/api/messages/', index, currentChat?.id] : null, ([, index, currentChatId]) => getChatMessages(currentChatId, PAGE_SIZE, index + 1), {
        revalidateOnFocus: false,
    })
    const messages = messagesResponse ? [].concat(...messagesResponse) : [];
    const isLoadingMoreMessages = isLoadingMessages || (size > 0 && messagesResponse && typeof messagesResponse[size - 1] === "undefined");
    const isEmpty = messagesResponse?.[0]?.length === 0;
    const isReachingEndMessages = isEmpty || (messagesResponse && messagesResponse[messagesResponse.length - 1]?.length < PAGE_SIZE) || (error && messages.length !== 0);

    if (error) {
        return (
            <h2 className="text-center font-semibold mt-4">
                Something went wrong.
            </h2>
        );
    }

    // if (isLoadingOtherUser) {
    //     return (
    //         <div className="flex items-center justify-center h-full">
    //             <Loading />
    //         </div>
    //     );
    // }

    console.log(messages)

    return (
        <div className="max-h-60 overflow-y-auto">
            <div className="flex flex-col mt-4 items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                    <UserAvatar image={otherUser?.image} username={otherUser?.username} />
                    <span className="font-semibold">
                        {
                            otherUser ?
                            `u/${otherUser.username}`
                            :
                            "User not found"
                        }
                    </span>
                </div>
                <div className="flex text-xs text-gray-500 items-center gap-2">
                    <span>{otherUser?.followers_count ?? "N/A"} Followers</span>
                    <span>{otherUser ? otherUser.comment_karma + otherUser.post_karma : "N/A"} Karma</span>
                    <span>
                        Joined {otherUser?.created_at ? formatDateShort(otherUser.created_at) : "N/A"}
                    </span>
                </div>
                <Link href={`/users/${otherUser?.id || -1}`} className="text-sm font-semibold bg-secondary px-3 py-2 rounded-2xl duration-200 hover:bg-ternary">
                    View Profile 
                </Link>
            </div>
            {
                !isLoadingMoreMessages && !isReachingEndMessages && !error && currentChat &&
                <Button className="mx-auto my-3 block" onClick={() => setSize(size + 1)}>
                    Load More
                </Button>
            }
            {
                (isLoadingMoreMessages && !isReachingEndMessages) &&
                <div className="my-3">
                    <Loading text="Loading Messages..." />
                </div>
            }
            <ChatMessages currentChatId={currentChat?.id} isBlocked={!!otherUser?.block_id} isLoading={isLoadingMessages} mutate={mutate} messagesData={messages} />
        </div>
    )
}

export default ChatModal;