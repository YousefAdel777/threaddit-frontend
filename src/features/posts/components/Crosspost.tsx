import Link from "next/link";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import LinkPreview from "./LinkPreview";
import MediaSwiper from "@/features/common/components/MediaSwiper";
import { formatDate } from "@/lib/utils";

type Props = {
    id: number;
    user: User;
    title: string;
    type: PostType;
    content?: string;
    link?: string;
    attachments?: Attachment[];
    created_at: string;
    community: Community | null;
    comments_count: number;
    interaction_diff: number;
}

const Crosspost = ({ id, user, title, type, content, link, attachments, community, created_at, comments_count, interaction_diff }: Props) => {

    let postContent;
    if (type === "text") {
        postContent = (
            <Markdown className="prose" rehypePlugins={[rehypeHighlight]}>
                {content}
            </Markdown>
        );
    }
    else if (type === "link" && link) {
        postContent = (
            <LinkPreview url={link} />
        );
    }
    else if (type === "media" && attachments) {
        postContent = (
            <MediaSwiper attachments={attachments} />
        );
    }

    return (
        <div className=" border-[1px] bg-white border-secondary rounded-xl p-2 duration-200 hover:bg-ternary">
            <h2 className="text-lg font-bold">
                {title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <Link href={`/users/${user.id}`} className="hover:underline">
                    {`u/${user.username}`}
                </Link>
                •
                {
                    community &&
                    <>
                        <Link href={`/communities/${community.id}`} className="hover:underline">
                            {`t/${community.name}`}
                        </Link>
                        <span>
                            •
                        </span>
                    </>
                }
                <span>
                    {formatDate(created_at)}
                </span>
            </div>
            {postContent}
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>
                    {interaction_diff}{" "}Upvotes
                </span>
                <Link onClick={e => e.stopPropagation()} href={`/posts/${id}`} className="hover:underline">
                    {comments_count}{" "}Comments
                </Link>
            </div>
        </div>
    );
}

export default Crosspost;