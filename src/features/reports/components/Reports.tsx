"use client"

import { useState } from "react";
import Select, { SingleValue } from "react-select";
import CommentReports from "./CommentReports";
import PostReports from "./PostReports";

type Props = {
    communityId: number,
}

const statusFilterOptions = [
    { label: "Pending", value: "pending" },
    { label: "Reviewed", value: "reviewed" },
    { label: "Dismissed", value: "dismissed" },
]

const reportTypeOptions = [
    { label: "Comment Reports", value: "commentReports" },
    { label: "Post Reports", value: "postReports" },
]

const Reports = ({ communityId }: Props) => {
    const [reportType, setReportType] = useState("postReports");
    const [reportStatusFitler, setReportStatusFilter] = useState("pending");

    return (
        <section className="mt-4 border-t-[1px] border-secondary">
            <div className="flex items-center gap-3">
                <Select instanceId="ract-select"
                    onChange={(selected: SingleValue<Option<string>>) => {
                        if (selected) {
                            setReportType(selected.value);
                        }
                    }}
                    value={reportTypeOptions.find((option) => option.value === reportType)}
                    options={reportTypeOptions}
                    className="w-52 mb-4 z-40"
                    isSearchable={false}
                />
                <Select instanceId="ract-select"
                    onChange={(selected: SingleValue<Option<string>>) => {
                        if (selected) {
                            setReportStatusFilter(selected.value);
                        }
                    }}
                    value={statusFilterOptions.find((option) => option.value === reportStatusFitler)}
                    options={statusFilterOptions}
                    className="w-52 mb-4 z-40"
                    isSearchable={false}
                />
            </div>
            {
                reportType === "postReports" ?
                <PostReports communityId={communityId} statusFilter={reportStatusFitler} />
                :
                <CommentReports communityId={communityId} statusFilter={reportStatusFitler} />
            }
        </section>
    );
}

export default Reports;