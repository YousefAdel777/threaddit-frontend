import { formatDateShort } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

type Props = {
    id: number;
    username: string;
    image: string | null;
    followers_count: number;
    bio?: string;
    created_at: string;
}

export default function User({ username, image, id, followers_count, bio, created_at }: Props) {
    return (
        <Link href={`/users/${id}`} className="flex px-3 py-4 items-center gap-6">
            <UserAvatar size={70} username={username} image={image} />
            <div className="space-y-1">
                <h3 className="hover:underline text-lg font-medium">
                    u/{username}
                </h3>
                {
                    bio && <p className="text-sm">{bio}</p>
                }
                <p className="text-xs">{followers_count} followers</p>
                <p className="text-xs">Joined {formatDateShort(created_at)}</p>
            </div>
        </Link>
    )
}