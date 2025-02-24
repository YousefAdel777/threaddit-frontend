import api from "./apiAxios";

export default async function getTopics() {
    const res = await api.get('/api/topics');
    return res.data;
}