import Image from "next/image";

type Props = {
    image?: string | null,
    username?: string,
    size?: number
}

const UserAvatar = ({ image, username, size = 50 }: Props) => {
    return (
        <Image
            className="rounded-full"
            src={image || "/images/user_image.webp"}
            width={size}
            height={size}
            alt={`${username} avatar`}
        />
    )
}

export default UserAvatar;