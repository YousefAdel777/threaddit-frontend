"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createChat, markAsRead } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { addMessageMutation } from "@/lib/mutations";
import { KeyedMutator } from "swr";
import GroupedMessages from "./GroupedMessages";
import { useChatsStore } from "@/stores/chatsStore";
import MessageForm from "./MessageForm";
import useInteresection from "../hooks/useIntersection";

type Props = {
    messagesData: Message[];
    isLoading: boolean;
    isBlocked: boolean; 
    mutate: KeyedMutator<Message[]>;
    currentChatId?: number;
}

const ChatMessages = ({ messagesData, isBlocked, mutate, isLoading, currentChatId }: Props) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    // const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const isMarkAsReadAllowed = !isLoading && !isBlocked && !isPending &&  messagesData?.some(message => !message.is_read && message.user.id !== Number(session?.userId));
    const { userId } = useChatsStore();
    const chatKey = (session?.accessToken && userId)  ? `ws://localhost:8000/ws/messages?participant=${userId}&token=${session.accessToken}` : null;
    const { target } = useInteresection(() => currentChatId && markAsRead(currentChatId), 0.5, !isMarkAsReadAllowed);

    useEffect(() => {
        if (!isLoading) {
            scrollToEnd();
        }
    }, [isLoading]);

    useEffect(() => {
        if (!chatKey) return;
        const ws = new WebSocket(chatKey);
        ws.onmessage = async (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.type === "send_message") {
                const message = data.message;
                await mutate([message, ...messagesData], {
                    optimisticData: [message, ...messagesData],
                    rollbackOnError: true,
                    revalidate: false,
                    populateCache: true
                });
                scrollToEnd();
            }
            if (data.type === "delete_message") {
                const messageId = data.message_id;
                await mutate(messagesData.filter(message => message.id !== messageId), {
                    rollbackOnError: true,
                    populateCache: true,
                    optimisticData: messagesData.filter(message => message.id !== messageId),
                    revalidate: false,
                });
            }
            if (data.type === "update_message") {
                const updatedMessages = messagesData.map(message => message.id === data.message.id ? data.message : message);
                await mutate(updatedMessages, {
                    rollbackOnError: true,
                    populateCache: true,
                    optimisticData: updatedMessages,
                    revalidate: false,
                });
            }
            if (data.type === "mark_as_read") {
                const messagesIds = data.messages_ids;
                const updatedMessages = messagesData.map(message => messagesIds.includes(message.id) ? ({ ...message, is_read: true }) : message);
                await mutate(updatedMessages, {
                    rollbackOnError: true,
                    populateCache: true,
                    optimisticData: updatedMessages,
                    revalidate: false,
                });
            }
        }

        ws.onerror = (error) => {
            console.log(error);
        }

        return () => ws.close();
    }, [chatKey, messagesData, mutate]);

    const scrollToEnd = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } 

    const sendMessage = (content: string) => {
        setErrorMessage("");
        if (content.length === 0) {
            return;
        }
        startTransition(async () => {
            let error;
            let chatId;
            if (!currentChatId) {
                const { error: chatError, id } = await createChat({ participants: [userId as number, Number(session?.userId)] });
                error = chatError;
                if (!error) {
                    chatId = id;
                }
                else {
                    return;
                }
            }
            else {
                chatId = currentChatId;
            }
            await addMessageMutation({ content, chat: chatId }, messagesData);
            scrollToEnd();
            if (error) {
                setErrorMessage(error);
            }
        });
    }

    console.log(isMarkAsReadAllowed);

    return (
        <div>
            <GroupedMessages messagesData={messagesData || []} mutate={mutate} />
            {
                messagesData &&
                <>
                    <div ref={target} />
                    <div ref={messagesEndRef} />
                </>
            }
            {
                !isBlocked &&
                <MessageForm sendMessage={sendMessage} isPending={isPending} errorMessage={errorMessage} />
            }
        </div>
    );
}

export default ChatMessages;