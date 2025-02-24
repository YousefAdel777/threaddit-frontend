import { formatDateShort } from "@/lib/utils";
import { useMemo } from "react";
import { KeyedMutator } from "swr";
import Message from "./Message";

type Props = {
    messagesData: Message[],
    mutate: KeyedMutator<Message[]>;
}

const GroupedMessages = ({ messagesData, mutate }: Props) => {

    const groupMessagesByDate = (messages: Message[]) => {
        return messages.reduce((groups: { [key: string]: Message[] }, message) => {
            const date = formatDateShort(message.created_at);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    };

    const groupedMessages = useMemo(() => groupMessagesByDate(messagesData), [messagesData]);    
    
    return (
        <div className="p-2 flex flex-col-reverse">
            {
                messagesData?.length > 0 &&
                Object.entries(groupedMessages).map(([date, messages]) => (
                    <div className="flex flex-col gap-3" key={date}>
                        <div className="flex items-center gap-4 my-2">
                            <hr className="w-full border-ternary" />
                            <p className="text-xs text-center w-full font-bold text-gray-500">{date}</p>
                            <hr className="w-full border-ternary" />
                        </div>
                        <div className="flex flex-col-reverse gap-1.5">
                            {
                                messages.map((message: Message) => (
                                    <Message key={message.id} mutate={mutate} messages={messagesData} {...message} />
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default GroupedMessages;