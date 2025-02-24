import useSWRInfinite from "swr/infinite";
import Button from "@/features/common/components/Button";
import Loading from "@/features/common/components/Loading";
import Report from "@/features/reports/components/Report";
import getCommentReports from "@/lib/getCommentReports";

type Props = {
    communityId: number;
    statusFilter: string;
}

const PAGE_SIZE = 20;

const CommentReports = ({ communityId, statusFilter }: Props) => {
    const { data: reportsResponse, isLoading: isLoadingReports, mutate: mutateReports, size: reportsSize, setSize: setReportsLimit, error } = useSWRInfinite((index) => ['/api/comment-reports/', index, statusFilter, communityId], ([, index]) => getCommentReports(communityId, statusFilter, PAGE_SIZE, index + 1));
    const reports = reportsResponse ? [].concat(...reportsResponse) : []
    const isLoadingMoreReports = isLoadingReports || (reportsSize > 0 && reportsResponse && typeof reportsResponse[reportsSize - 1] === "undefined");
    const isEmpty = reportsResponse?.[0]?.length === 0;
    const isReachingEndReports = isEmpty || (reportsResponse && reportsResponse[reportsResponse.length - 1]?.length < PAGE_SIZE) || (error && reports.length !== 0);    

    if (error && reports.length === 0) {
        return (
            <h2 className="text-lg my-5 text-center font-semibold">Something went wrong.</h2>
        );
    }

    return (
        <div>
            {
                reports?.length === 0 && !isLoadingMoreReports && !error ?
                <h2 className="text-lg my-5 text-center font-semibold">No Reports.</h2>
                :
                <div>
                    <div>
                        <>
                            {
                                reports?.length === 0 && !isLoadingReports ?
                                <h2 className="text-lg text-center my-5 font-semibold">No Upvoted Reports.</h2>
                                :
                                reports?.map((report: CommentReport) => (
                                    <Report
                                        key={report.id}
                                        contentType="comment" 
                                        reportedContentUrl={`/comments/${report.comment.id}`} 
                                        reportedContentText={report.comment.content} 
                                        reports={reports}
                                        mutate={mutateReports} 
                                        {...report}
                                    />
                                ))
                            }
                            {
                                isLoadingMoreReports && !isReachingEndReports &&
                                <div className="my-5">
                                    <Loading text="Loading reports..." />
                                </div>
                            }
                        </>
                            {
                                !isLoadingMoreReports && !isReachingEndReports &&
                                <Button className="my-5 mx-auto block" onClick={() => setReportsLimit(reportsSize + 1)}>
                                    Show More Reports
                                </Button>
                            }
                    </div>
                </div>
            }
        </div>
    )
}

export default CommentReports;