import { formatDateShort } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { KeyedMutator } from "swr";
import { updateCommentReportMutation, updateCommentReportOptions, updatePostReportMutation, updatePostReportOptions } from "@/lib/mutations";
import ReportMenu from "./ReportMenu";
import UserAvatar from "@/features/users/components/UserAvatar";

type Props = {
    id: number;
    reason: string;
    status: ReportStatus;
    reportedContentText: string;
    user: User;
    reportedContentUrl: string;
    contentType: "post" | "comment";
    created_at: string;
    reports: (CommentReport | PostReport)[];
    violated_rule?: Rule;
    mutate: KeyedMutator<unknown>;
}

const Report = ({ id, violated_rule, reason, reportedContentText, reportedContentUrl, mutate, user, contentType, created_at, status, reports }: Props) => {
    const [isShowReason, setIsShowReason] = useState(false);

    const handleReportUpdate = async (status: ReportStatus) => {
        if (contentType === "comment") {
            await mutate(
                updateCommentReportMutation(id, { status }, reports as CommentReport[]),
                updateCommentReportOptions(id, { status }, reports as CommentReport[]),
            );
        }
        else if (contentType === "post") {
            await mutate(
                updatePostReportMutation(id, { status }, reports as PostReport[]),
                updatePostReportOptions(id, { status }, reports as PostReport[]),
            );
        }
    }

    return (
        <div className="py-2 border-y-[1px]">
            <div className="py-3 px-3 border-secondary duration-200 rounded-lg space-y-2 hover:bg-secondary">
                <div className="flex items-center justify-between">
                    <Link href={`/users/${user.id}`} className="flex mt-1 items-center gap-3">
                        <UserAvatar size={30} username={user.username} image={user.image} />
                        <span className="hover:underline text-sm">
                            u/{user.username}
                        </span>
                        <span className={`status-label ${status === "pending" ? "bg-yellow-400" : status === "dismissed" ? "bg-red-500" : "bg-primary"}`}>
                            {status.toUpperCase()}
                        </span>
                    </Link>
                    <ReportMenu 
                        status={status} 
                        handleReportUpdate={handleReportUpdate}
                    />
                </div>
                <p className="text-nowrap text-sm overflow-hidden text-ellipsis">
                    Reported the {contentType} {" "}
                    <Link href={reportedContentUrl} className="font-semibold hover:underline">
                        {reportedContentText}
                    </Link>
                </p>
                <div className="flex text-xs text-gray-500 items-center gap-3">
                    <span>
                        Reported on: {formatDateShort(created_at)}
                    </span>
                    <span>
                        Violated Rule: {violated_rule?.title || "Not specified"}
                    </span>
                </div>
                <div className={`${isShowReason ? "max-h-none" : "max-h-28"}`}>
                    <p className="text-sm overflow-hidden text-nowrap text-ellipsis">
                        {reason}
                    </p>
                </div>
                <div 
                    onClick={() => setIsShowReason(!isShowReason)} 
                    className="flex select-none items-center gap-2 cursor-pointer text-gray-500 font-semibold"
                >
                    <span className="text-xs">
                        {isShowReason ? "Show Less" : "Show More"}
                    </span>
                    <BiChevronDown className={`text-xl duration-200 ${isShowReason ? "rotate-180" : ""}`} />
                </div>
            </div>
        </div>
    );
}

export default Report;