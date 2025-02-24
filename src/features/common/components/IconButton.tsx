type Props = {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const IconButton = ({ children, className, onClick }: Props) => {
    return (
        <button 
            onClick={onClick} 
            className={`flex text-xl items-center justify-center rounded-full p-2 hover:bg-secondary hover:bg-opacity-30 duration-200 w-10 h-10 ${className || ""}`}>
                {children}
        </button>
    );
}

export default IconButton;