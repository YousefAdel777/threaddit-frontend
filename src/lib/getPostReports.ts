import api from "./api"

const getPostReports = async (community?: number, status?: string, per_page?: number, page?: number) => {
    const res = await api.get(`/api/post-reports/?post__community=${community || ""}&status=${status || ""}&per_page=${per_page || ""}&page=${page || ""}`);
    return res.results;
}

export default getPostReports;