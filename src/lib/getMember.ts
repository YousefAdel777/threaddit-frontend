import api from "./api";

export default async function getMember(communityId: number, userId: number): Promise<Member> {
    return await api.get(`/api/members?community=${communityId}&user=${userId}`);
}