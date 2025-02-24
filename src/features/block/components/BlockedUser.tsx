import UserAvatar from "@/features/users/components/UserAvatar";
import Button from "@/features/common/components/Button";
import { KeyedMutator } from "swr";
import { deleteBlockMutation, deleteBlockOptions } from "@/lib/mutations";

type Props = {
    username: string,
    image: string | null,
    block_id: number,
    bio: string | null,
    created_at: string,
    followers_count: number,
    post_karma: number,
    comment_karma: number,
    users: User[]
    mutate: KeyedMutator<User[]>,
}

const BlockedUser = ({ username, image, block_id, bio, followers_count, post_karma, comment_karma, users, mutate }: Props) => {

    const handleUnblock = () => {
        mutate(
            deleteBlockMutation(block_id, users),
            deleteBlockOptions(block_id, users)
        );
    }

    return (
        <div className="flex items-start px-3 py-4 gap-4">
            <UserAvatar size={70} username={username} image={image} />
            <div className="space-y-1">
                <h3 className="text-lg font-medium">
                    u/{username}
                </h3>
                <div className="text-sm">
                    <p>{bio || ""}</p>
                    <p>{followers_count} followers</p>
                    <p>Karma: {post_karma + comment_karma}</p>
                    <Button className="mt-2" onClick={handleUnblock}>
                        Unblock
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BlockedUser;