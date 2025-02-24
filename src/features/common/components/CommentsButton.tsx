import { BiComment } from "react-icons/bi";

type Props = {
    onClick?: () => void;
    children?: React.ReactNode;
}

const CommentsButton = ({ onClick, children }: Props) => {
    return (
        <button onClick={onClick} className="px-3 py-2 bg-ternary flex items-center justify-center rounded-3xl cursor-pointer duration-200">
            <div className="flex items-center gap-3">
                <BiComment className="text-xl" />
                <span>
                    {children}
                </span>
            </div>
        </button>
    );
}

export default CommentsButton;