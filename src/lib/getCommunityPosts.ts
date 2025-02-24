import api from "./apiAxios";

export default async function getCommunityPosts(communityId: number, status?: string, ordering?: string,  perPage?: number, page?: number) {
    const res = await api.get(`/api/posts?community=${communityId}&status=${status || ""}&ordering=${ordering || ""}&per_page=${perPage || ""}&page=${page || 1}`);
    return res.data.results;
}