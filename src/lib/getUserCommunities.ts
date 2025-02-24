import api from "./apiAxios";

export default async function getUserCommunities () {
    const res = await api.get('/api/user/communities');
    return res.data;
}