import { FaX } from "react-icons/fa6";
import IconButton from "./IconButton";

type Props = {
    title: string;
    description?: string;
    children?: React.ReactNode
    className?: string
    closeModal: () => void;
}

const Modal = ({ title, description, className, children, closeModal }: Props) => {
    return (
        <div className={`fixed z-50 bottom-0 bg-black/20 h-full w-full left-0 top-0 flex items-center justify-center ${className || ""}`}>
            <div className="w-full lg:container">
                <div className="bg-white w-full animate-fade-in rounded-lg relative px-8 py-6 max-h-svh overflow-y-auto lg:max-h-none lg:mx-auto lg:max-w-4xl">
                    <span className="absolute top-4 right-4">
                        <IconButton className="text-gray-500" onClick={closeModal}>
                            <FaX />
                        </IconButton>
                    </span>
                    <h2 className="text-2xl font-bold mb-1">
                        {title}
                    </h2>
                    <p className="text-sm mb-4">
                        {description}
                    </p>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;