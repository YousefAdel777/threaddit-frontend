import api from "./api";

export default async function getUsers(search?: string, page?: number, perPage?: number) {
    const res = await api.get(`/api/users?search=${search || ""}&page=${page || ""}&per_page=${perPage || ""}`);
    return res;
}