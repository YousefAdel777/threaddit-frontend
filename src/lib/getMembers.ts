import api from "./api";

export default async function getMembers(communityId: number, search: string | null, userId?: number): Promise<Member[]> {
    return await api.get(`/api/members?community=${communityId}&user=${userId || ""}&search=${search || ""}`);
}