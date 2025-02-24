import api from "./apiAxios";

export default async function getPaginatedCommunities(search?: string, page?: number, perPage?: number, topicId?: number) {
    const res = await api.get(`/api/communities?search=${search || ""}&page=${page || ""}&per_page=${perPage || ""}&topics=${topicId || ""}`);
    return res.data.results;
}