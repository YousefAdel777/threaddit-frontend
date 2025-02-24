import api from "./apiAxios";

export default async function getPaginatedUsers(search?: string, ordering?: string, page?: number, perPage?: number) {
    const res = await api.get(`/api/users?search=${search || ""}&page=${page || ""}&ordering=${ordering || ""}&per_page=${perPage || ""}`);
    return res.data.results;
}