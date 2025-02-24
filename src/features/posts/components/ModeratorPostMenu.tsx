import { updatePostMutation, updatePostOptions } from "@/lib/mutations";
import { useState } from "react";
import { KeyedMutator } from "swr";
import { IoShieldOutline } from "react-icons/io5";
import { FaBan, FaCheck } from "react-icons/fa6";
import MenuItem from "@/features/common/components/MenuItem";
import Menu from "@/features/common/components/Menu";
import { InfiniteKeyedMutator } from "swr/infinite";

type Props<T> = {
    id: number;
    status: PostStatus;
    mutate: KeyedMutator<T> | InfiniteKeyedMutator<T>;
    data: T;
}

const ModeratorPostMenu = <T extends Post | Post[][]>({ id, mutate, data: postData, status }: Props<T>) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    let statusOptions;

    const handlePostUpdate = async (data: Partial<Post>) => {
        await mutate(await updatePostMutation(id, data, postData), updatePostOptions(id, data, postData));
    }

    if (status === "accepted") {
        statusOptions = (
            <MenuItem onClick={async () => await handlePostUpdate({ status: "removed" })}>
                <FaBan className="text-xl text-red-500" />
                <span className="text-red-500">
                    Remove
                </span>
            </MenuItem>
        );
    }
    else if (status === "removed") {
        statusOptions = (
            <MenuItem onClick={async () => await handlePostUpdate({ status: "accepted" })}>
                <FaCheck className="text-xl text-primary" />
                <span>
                    Accept
                </span>
            </MenuItem>
        );
    }
    else {
        statusOptions = (
            <>
                <MenuItem onClick={async () => await handlePostUpdate({ status: "accepted" })}>
                    <FaCheck className="text-xl text-primary" />
                    <span>
                        Accept
                    </span>
                </MenuItem>
                <MenuItem onClick={async () => await handlePostUpdate({ status: "removed" })}>
                    <FaBan className="text-xl text-red-500" />
                    <span className="text-red-500">
                        Remove
                    </span>
                </MenuItem>
            </>
        );
    }


    return (
        <div className="relative">
            <button
                onFocus={() => setIsMenuOpen(true)}
                onClick={e => {
                    e.stopPropagation();
                }}
                onBlur={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-ternary duration-200"
            >
                <IoShieldOutline className="text-xl text-primary" />
            </button>
            {
                isMenuOpen &&
                <Menu className="">
                    {statusOptions}
                </Menu>
            }
        </div>
    );
}

export default ModeratorPostMenu;