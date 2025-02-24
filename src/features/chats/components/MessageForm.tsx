import { useState } from "react";
import { IoIosSend } from "react-icons/io";

type Props = {
    isPending: boolean;
    sendMessage: (content: string) => void;
    errorMessage?: string;
};

const MessageForm = ({ sendMessage, errorMessage, isPending }: Props) => {
    const [content, setContent] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(content);
        setContent("");
    }

    return (
        <div className="bg-white h-20 absolute bottom-0 left-1/2 -translate-x-1/2 w-full">
            <form
                onSubmit={handleSubmit}
                className="flex gap-3 items-center h-full px-4 mb-1"
            >
                <input 
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-input"
                    placeholder="Type a message..."
                />
                <button disabled={isPending} className={`${isPending ? "opacity-50" : ""}`}>
                    <IoIosSend className="text-2xl text-primary" />
                </button>
            </form>
            <p className={`error ${errorMessage ? "opacity-100" : ""}`}>
                {errorMessage}
            </p>
        </div>
    );
}

export default MessageForm;