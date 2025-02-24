import api from "./apiAxios"

const getCommunityRules = async (communityId: number) => {
    const res = await api.get(`/api/rules?community=${communityId}`);
    return res.data;
}

export default getCommunityRules;