import { deletePostMutation, deletePostOptions, deleteSavedPostMutation, deleteSavedPostOptions, savePostMutation, savePostOptions } from "@/lib/mutations";
import { useState } from "react";
import { FaBookmark, FaFlag, FaRegBookmark, FaRegFlag } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { RiStackshareLine } from "react-icons/ri";
import { KeyedMutator } from "swr";
import MenuButton from "@/features/common/components/MenuButton";
import Menu from "@/features/common/components/Menu";
import MenuItem from "@/features/common/components/MenuItem";
import { useRouter } from "next/navigation";
import { BiEdit } from "react-icons/bi";
import { InfiniteKeyedMutator } from "swr/infinite";

type Props<T> = {
    id: number;
    saved_post_id: number | null;
    community: Community | null;
    type: PostType;
    is_author: boolean;
    is_reported: boolean;
    data: T;
    mutate: KeyedMutator<T> | InfiniteKeyedMutator<T>;
    openReportForm: () => void;
    openCrosspostForm: () => void;
}

const PostMenu = <T extends Post | Post[][]>({ id, saved_post_id, community, type, data, is_author, is_reported, mutate, openReportForm, openCrosspostForm }: Props<T>) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const showReportButton = !is_author && community && !community.is_moderator;

    const handleSave = async () => {
        if (saved_post_id) {
            await mutate(await deleteSavedPostMutation(saved_post_id, data), deleteSavedPostOptions(saved_post_id, data));
        }
        else {
            await mutate(await savePostMutation(id, data), savePostOptions(id, data));
        }
    }

    const handleDelete = async () => {
        await mutate(deletePostMutation(id, data), deletePostOptions(id, data));
    }
    
    return (
        <div className="relative">
            <MenuButton 
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
            />
            {
                isMenuOpen &&
                <Menu>
                    {
                        is_author &&
                        <MenuItem 
                            onClick={handleDelete}
                            className="text-red-500"
                        >
                            <FaRegTrashCan className="text-xl" />
                            <span>Delete</span>
                        </MenuItem>
                    }
                    {
                        is_author &&
                        <MenuItem onClick={() => router.push(`/edit-post/${id}`)}>
                            <BiEdit className="text-xl text-primary" />
                            <span>Edit</span>
                        </MenuItem>
                    }
                    {
                        showReportButton &&
                        <MenuItem 
                            onClick={() => {
                                if (!is_reported) {
                                    openReportForm();
                                }
                            }}
                        >
                            {
                                is_reported ?
                                <FaFlag className="text-xl text-primary" />
                                :
                                <FaRegFlag className="text-xl text-primary" />
                            }
                            <span>{is_reported ? "Reported" : "Report"}</span>
                        </MenuItem>
                    }
                    <MenuItem 
                        onClick={handleSave}
                    >
                        {
                            saved_post_id ?
                            <FaBookmark className="text-xl text-primary" />
                            :
                            <FaRegBookmark className="text-xl text-primary" />
                        }
                        <span>{saved_post_id ? "Saved" : "Save"}</span>
                    </MenuItem>
                    {
                        type !== "crosspost" &&
                        <MenuItem onClick={openCrosspostForm}>
                            <RiStackshareLine className="text-xl text-primary" />
                            Crosspost
                        </MenuItem>
                    }
                </Menu>
            }
        </div>
    );
}

export default PostMenu;