import { useState } from "react";
import { KeyedMutator } from "swr";
import MenuButton from "@/features/common/components/MenuButton";
import MenuItem from "@/features/common/components/MenuItem";
import Menu from "@/features/common/components/Menu";
import { FaFlag, FaRegFlag } from "react-icons/fa";
import { BiEdit, BiTrash } from "react-icons/bi";
import { deleteCommentMutation, deleteCommentOptions } from "@/lib/mutations";

type Props = {
    id: number,
    comments: CommentType[],
    is_author: boolean,
    is_reported: boolean,
    isReportable: boolean,
    openReportForm: () => void,
    mutate: KeyedMutator<unknown>,
    openEditForm?: () => void,
}

const CommentMenu = ({ id, comments, is_author, is_reported, isReportable, openReportForm, mutate, openEditForm }: Props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleDelete = async () => {
        await mutate(
            deleteCommentMutation(id, comments),
            deleteCommentOptions(id, comments)
        )
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
                        isReportable &&
                        <MenuItem onClick={() => {
                            if (!is_reported) {
                                openReportForm();
                            }
                        }}>
                            {
                                is_reported ?
                                <FaFlag className="text-xl text-primary" />
                                :
                                <FaRegFlag className="text-xl text-primary" />
                            }
                            <span>{is_reported ? "Reported" : "Report"}</span>
                        </MenuItem>
                    }
                    {
                        is_author &&
                        <>
                            {
                                openEditForm &&
                                <MenuItem onClick={openEditForm}>
                                    <BiEdit className="text-xl" />
                                    <span>Edit</span>
                                </MenuItem>
                            }
                            <MenuItem className="text-red-500" onClick={handleDelete}>
                                <BiTrash className="text-xl" />
                                <span>Delete</span>
                            </MenuItem>
                        </>
                    }
                </Menu>
            }
        </div>
    );
}

export default CommentMenu;