import api from "./apiAxios";

const getFeed = async (per_page?: number, page?: number) => {
    const res = await api.get(`/api/feed?per_page=${per_page || ""}&page=${page || ""}`);
    return res.data.results;
}

export default getFeed;