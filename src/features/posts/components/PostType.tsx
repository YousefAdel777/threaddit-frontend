type Props = {
    type: string;
    onClick?: () => void;
    isActive?: boolean;
}

const PostType = ({ onClick, isActive, type }: Props) => {
    return (
        <button onClick={onClick} className={`${isActive ? "bg-secondary" : "bg-white"} block px-5 py-3 relative hover:bg-secondary duration-200`}>
            <span className={` block bg-primary h-1 duration-200 absolute bottom-0 left-1/2 -translate-x-1/2 ${isActive ? "w-full" : " w-0"}`}></span>
            <span className="font-semibold">{type}</span>
        </button>
    );
}

export default PostType;