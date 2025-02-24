import api from "./api";

export default async function getBlockedUsers(perPage?: number, page?: number) {
    const res = await api.get(`/api/blocked-users?per_page=${perPage || ""}&page=${page || ""}`);
    return res.results;
}