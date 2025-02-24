import { HiDotsVertical } from "react-icons/hi";

type Props = {
    setIsMenuOpen: (isOpen: boolean) => void,
    isMenuOpen: boolean,
}

const MenuButton = ({ setIsMenuOpen, isMenuOpen }: Props) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
            }}
            onBlur={() => setIsMenuOpen(false)}
            tabIndex={-1}
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-ternary duration-200"
        >
            <HiDotsVertical className="text-2xl text-gray-500" />
        </button>
    )
}

export default MenuButton;