type Props = {
    children?: React.ReactNode,
    className?: string
}

const Menu = ({ children, className }: Props) => {
    return (
        <div 
            onMouseDown={e => e.preventDefault()} 
            onClick={e => e.stopPropagation()} 
            className={`text-sm z-20 overflow-hidden font-semibold absolute right-0 -bottom-1 translate-y-full bg-white shadow-lg rounded-lg divide-y-[1px] divide-ternary  ${className || ""}`}
        >
            {children}
        </div>
    );
}

export default Menu;