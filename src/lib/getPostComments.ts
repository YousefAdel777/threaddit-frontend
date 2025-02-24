import api from "./apiAxios";

export default async function getPostComments(postId?: number, ordering?: string, perPage?: number, page?: number) {
    const res = await api.get(`/api/comments?post=${postId || ""}&ordering=${ordering || ""}&per_page=${perPage || ""}&page=${page || 1}`);
    return res.data.results;
}