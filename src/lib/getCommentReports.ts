import api from "./api"

const getCommentReports = async (communityId?: number, status?: string, per_page?: number, page?: number) => {
    const res = await api.get(`/api/comment-reports/?comment__post__community=${communityId || ""}&status=${status || ""}&per_page=${per_page || ""}&page=${page || ""}`);
    return res.results;
}

export default getCommentReports;