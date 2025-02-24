import { BiUpvote, BiSolidUpvote, BiSolidDownvote, BiDownvote } from "react-icons/bi";

type Props = {
    handleUpvote: () => unknown;
    handleDownvote: () => unknown;
    interaction_diff: number;
    isUpvoted: boolean;
    isDownvoted: boolean;
}

const InteractionButtons = ({ handleUpvote, handleDownvote, interaction_diff, isUpvoted, isDownvoted }: Props) => {
    return (
        <div className="flex items-center gap-3 rounded-3xl bg-ternary">
            <button                 
                onClick={async (e) => {
                    e.stopPropagation();
                    await handleUpvote();
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-secondary duration-200"
            >
                {
                    isUpvoted ?
                    <BiSolidUpvote className="text-xl text-primary" />
                    :
                    <BiUpvote className="text-xl" />
                }
            </button>
            <span>
                {interaction_diff}
            </span>
            <button 
                onClick={async (e) => {
                    e.stopPropagation();
                    await handleDownvote();
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-secondary duration-200"
            >
                {
                    isDownvoted ?
                    <BiSolidDownvote className="text-xl text-red-600" />
                    :
                    <BiDownvote className="text-xl" />
                }
            </button>
        </div>
    );
}

export default InteractionButtons;