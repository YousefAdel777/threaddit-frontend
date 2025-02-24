import Markdown from "react-markdown";
import rehypeHighlit from "rehype-highlight";
import MediaSwiper from "@/features/common/components/MediaSwiper";
import LinkPreview from "./LinkPreview";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Crosspost from "./Crosspost";

type Props = {
    title: string;
    type: PostType;
    content?: string;
    link?: string;
    attachments?: Attachment[];
    original_post: Post | null;
    is_spoiler: boolean;
    is_nsfw: boolean;
}

const PostContent = ({ title, type, content, link, attachments, original_post, is_spoiler, is_nsfw }: Props) => {
    const [showPost, setShowPost] = useState(!is_spoiler && !is_nsfw);
    let postContent;
    if (type === "text") {
        postContent = (
            <div className="prose">
                <Markdown rehypePlugins={[rehypeHighlit]}>
                    {content}
                </Markdown>
            </div>
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
    else if (type === "crosspost") {
        if (original_post) {
            postContent = (
                <Crosspost {...original_post} />
            );
        }
        else {
            postContent = (
                <p className="text-sm text-gray-500">
                    Original post not found
                </p>
            );
        }
    }
    
    return (
        <div>
            <div className="flex items-center gap-3">
                {
                    is_nsfw &&
                    <span 
                        className="status-label bg-red-500"
                    >
                        NSFW
                    </span>
                }
                {
                    is_spoiler &&
                    <span 
                        className="status-label bg-zinc-800"
                    >
                        Spoiler
                    </span>
                }
                {
                    (is_nsfw || is_spoiler) &&
                    <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full duration-200 hover:bg-ternary" 
                        onClick={e => {
                            e.stopPropagation();
                            setShowPost(!showPost);
                        }}
                    >
                        {
                            showPost ?
                            <FaRegEye className="text-xl text-primary" />
                            :
                            <FaRegEyeSlash className="text-xl text-primary" />
                        }
                    </button>
                }
            </div>
            <div className="relative">
                <div className="px-2">
                    <h2 className="text-xl mb-1 font-bold">
                        {title}
                    </h2>
                    {postContent}
                    {
                        !showPost &&
                        <div onClick={e => e.stopPropagation()} className="absolute backdrop-blur-sm left-0 top-0 w-full h-full rounded-lg flex items-center justify-center ">
                            <button className="p-2 rounded-xl font-semibold text-xs bg-ternary duration-200 hover:bg-white" onClick={() => setShowPost(true)}>
                                {is_nsfw ? "Show NSFW Post" : "Show Spoiler Post"}
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default PostContent;