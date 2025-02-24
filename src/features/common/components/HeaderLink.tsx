import NavLink from "@/features/common/components/NavLink"

type Props = {
    href: string
    children?: React.ReactNode
}

const HeaderLink = ({ href, children }: Props) => {
    return (
        <NavLink className="text-sm px-3 py-2 rounded-3xl duration-200 hover:underline hover:bg-ternary" href={href}>
            {children}
        </NavLink>
    );
}

export default HeaderLink;