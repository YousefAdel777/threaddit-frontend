import { formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import useInteresection from "../hooks/useIntersection";
import { useState } from "react";
import { deleteMessageMutation, deleteMessageOptions, updateMessageMutation, updateMessageOptions } from "@/lib/mutations";
import { BiChevronDown, BiTrash } from "react-icons/bi";
import { KeyedMutator } from "swr";
import { LuCheck, LuCheckCheck } from "react-icons/lu";

type Props = {
    id: number,
    user: User,
    content: string,
    created_at: string,
    messages: Message[],
    is_read: boolean,
    mutate: KeyedMutator<Message[]>,
}

const Message = ({ id, content, user, created_at, messages, mutate, is_read}: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { data: session } = useSession();
    const isCurrentUser = Number(session?.userId) === user?.id;
    // const { target } = useInteresection(async () => await handleMessageUpdate(), 1.0, isCurrentUser || is_read || isUpdating);
    const { target } = useInteresection(async () => await handleMessageUpdate(), 1.0, true);


    const handleMessageUpdate = async () => {
        setIsUpdating(true);
        await mutate(updateMessageMutation(id, { is_read: true }, messages), updateMessageOptions(id, { is_read: true }, messages));
        setIsUpdating(false);
    }

    const handleMessageDelete = async () => {
        await mutate(deleteMessageMutation(id, messages), deleteMessageOptions(id, messages));
    }

    return (
        <div ref={target} className={`px-3 py-1.5 rounded-xl shadow-md w-fit max-w-[50%] ${isCurrentUser ? "bg-primary text-white" : "bg-ternary ml-auto"}`}>
            <p className={`text-sm font-medium text-wrap break-words`}>
                {content}
            </p>
            <div className="flex items-center justify-end gap-1">
                <span className={`text-lg ${isCurrentUser ? "text-white" : ""}`}>
                    {
                        is_read ?
                        <LuCheckCheck />
                        :
                        <LuCheck />
                    }
                </span>
                <span className={`text-[10px] font-semibold block`}>{formatTime(created_at)}</span>
                {
                    isCurrentUser &&
                    <div 
                        onBlur={() => setIsMenuOpen(false)}
                        tabIndex={0}
                        className="cursor-pointer relative"
                    >
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="w-7 h-7 rounded-full flex items-center justify-center duration-200 hover:bg-primary-hover"
                        >
                            <BiChevronDown className={`text-white duration-200 text-2xl ${isMenuOpen ? "rotate-180" : ""}`} />
                        </button>
                        {
                            isMenuOpen &&
                            <div onMouseDown={e => e.preventDefault()} className="bg-white absolute translate-y-full -bottom-1 -right-4 rounded-lg border-[1px] border-secondary">
                                <button className="text-red-600 flex gap-3 px-4 py-3 duration-200 hover:bg-secondary" onClick={handleMessageDelete}>
                                    <BiTrash className="text-xl" />
                                    <span className="text-xs font-semibold">Delete</span>
                                </button>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Message;