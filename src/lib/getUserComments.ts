import api from "./apiAxios";

export default async function getUserComments(userId: number, ordering?: string, perPage?: number, page?: number) {
    const res = await api.get(`/api/comments?user=${userId}&ordering=${ordering || ""}&per_page=${perPage || ""}&page=${page || 1}`);
    return res.data.results;
}