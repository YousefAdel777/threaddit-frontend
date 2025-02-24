import Image from "next/image";
import Link from "next/link"

type Props = {
    id: number;
    username: string;
    image: string | null;
    followers_count: number;
}

export default function UserSearchResult({ id, username, image, followers_count }: Props) {
    return (
        <Link href={`/users/${id}`} className="flex pt-3 px-2 items-center gap-5">
            <div>
                <Image width={40} height={40} src={image || "/images/user_image.webp"} alt={`${username} profile image`} className="rounded-full" />
            </div>
            <div>
                <p className="font-semibold">u/{username}</p>
                <p className="text-xs">{followers_count} followers</p>
            </div>
        </Link>
    )
}