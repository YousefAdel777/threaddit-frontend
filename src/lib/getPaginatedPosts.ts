import api from "./apiAxios";

export default async function getPosts(search?: string, ordering?: string, page?: number, perPage?: number) {
    const res = await api.get(`/api/posts?search=${search}&ordering=${ordering}&page=${page}&per_page=${perPage}`);
    return res.data.results;
}