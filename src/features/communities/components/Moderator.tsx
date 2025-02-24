import Link from "next/link";
import UserAvatar from "@/features/users/components/UserAvatar";

type Props = {
    id: number;
    username: string;
    image: string | null;
}

export default function Moderator({ username, image, id }: Props) {
    return (
        <Link href={`/users/${id}`} className="flex items-center p-2 gap-3">
            <UserAvatar image={image} username={username} />
            <p className="hover:underline">
                u/{username}
            </p>
        </Link>
    )
}