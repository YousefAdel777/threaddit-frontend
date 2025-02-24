import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { KeyedMutator } from "swr";
import PostMenu from "./PostMenu";
import { InfiniteKeyedMutator } from "swr/infinite";

type Props<T> = {
    id: number;
    user: User;
    type: PostType;
    community: Community | null;
    status: PostStatus;
    saved_post_id: number | null;
    created_at: string;
    is_author: boolean;
    is_reported: boolean;
    data: T;
    mutate: KeyedMutator<T> | InfiniteKeyedMutator<T>;
    openReportForm: () => void;
    openCrossPostForm: () => void;
}

const CommunityPostHeader = <T extends Post | Post[][]>({ id, created_at, user, community, type, status, is_author, data, mutate, saved_post_id, is_reported, openReportForm, openCrossPostForm }: Props<T>) => {
    const showStatus = is_author || community?.is_moderator;

    return (
            <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                    <Link className="flex items-center gap-2" href={`/users/${user.id}`}>
                        <Image className="rounded-full" src={user.image || "/images/user_image.webp"} alt="User Image" width={30} height={30} />
                        <span className="text-sm font-medium">u/{user.username}</span>
                    </Link>
                    <span className="text-xs">
                        {formatDate(created_at)}
                    </span>
                    {
                        showStatus &&
                        <span 
                            className={`status-label ${status === "accepted" ? "bg-primary" : status === "removed" ? "bg-red-500" : "bg-yellow-400"}`}
                        >
                            {status.toUpperCase()}
                        </span>
                    }
                </div>
                <PostMenu
                    id={id}
                    saved_post_id={saved_post_id}
                    data={data}
                    mutate={mutate}
                    is_author={is_author}
                    is_reported={is_reported}
                    openReportForm={openReportForm}
                    community={community}
                    type={type}
                    openCrosspostForm={openCrossPostForm}
                />
            </div>
    );
}

export default CommunityPostHeader;