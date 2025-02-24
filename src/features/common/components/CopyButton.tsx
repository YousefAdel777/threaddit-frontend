import { useEffect, useState } from "react"

type Props = {
    children: React.ReactNode;
    text: string;
    message: string;
}

const CopyButton = ({ children, message, text }: Props) => {
    const [isCopied, setIsCopied] = useState(false);
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isCopied) {
            timeout = setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [isCopied]);

    return (
        <button 
            onClick={async (e) => {
                e.stopPropagation();
                await navigator.clipboard.writeText(text);
                setIsCopied(true)
            }} 
            className="px-3 py-2 bg-ternary flex items-center justify-center rounded-3xl cursor-pointer duration-200"
        >
            <div className="flex items-center gap-3">
                {
                    isCopied ?
                    <span className="text-xs">
                        {message}
                    </span>
                    :
                    children
                }
            </div>
        </button>
    );
}

export default CopyButton;