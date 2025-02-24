import UserAvatar from "@/features/users/components/UserAvatar";
import HeaderLink from "@/features/common/components/HeaderLink";

type Props = {
    userId: number;
    username: string;
    image: string | null;
    is_current_user: boolean;
    bio?: string;
}

export default function ProfileHeader({ username, image, userId, is_current_user, bio }: Props) {
    return (
        <div className="mb-4">
            <div className="flex mb-6 items-center gap-5">
                <UserAvatar size={70} image={image} username={username} />
                <div>
                    <h2 className="font-bold text-2xl">
                        u/{username}
                    </h2>
                    <p className="text-sm">
                        {bio}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <HeaderLink href={`/users/${userId}/posts`}>
                    Posts
                </HeaderLink>
                <HeaderLink href={`/users/${userId}/comments`}>
                    Comments
                </HeaderLink>
                {
                    is_current_user &&
                    <>
                        <HeaderLink href={`/users/${userId}/saved-posts`}>
                            Saved
                        </HeaderLink>
                        <HeaderLink href={`/users/${userId}/upvoted`}>
                            Upvoted
                        </HeaderLink>
                        <HeaderLink href={`/users/${userId}/downvoted`}>
                            Downvoted
                        </HeaderLink>
                        <HeaderLink href={`/users/${userId}/blocked-users`}>
                            Blocked
                        </HeaderLink>
                    </>
                }
            </div>
        </div>
    );
}