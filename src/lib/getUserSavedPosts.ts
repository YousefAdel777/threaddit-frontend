import api from "./api";

export default async function getUserSavedPosts(ordering: string, perPage?: number, page?: number) {
    const res = await api.get(`/api/user/saved-posts?ordering=${ordering || ""}&per_page=${perPage || ""}&page=${page || 1}`);
    return res?.results;
}