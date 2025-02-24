import Image from "next/image";

type Props = {
    icon?: string | null,
    name: string,
    size?: number,
}

const CommunityAvatar = ({ name, icon, size = 50 }: Props) => {
    return (
        <Image 
            src={icon || "/images/community_image.webp"} 
            alt={`${name} community icon`}
            className="rounded-full"
            width={size}
            height={size}
        />
    )
}

export default CommunityAvatar;