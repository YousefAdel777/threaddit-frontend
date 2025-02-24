import api from "./apiAxios";

const getPopularPosts = async (page?: number, per_page?: number) => {
    const res = await api.get(`/api/popular?page=${page || ""}&per_page=${per_page || ""}`);
    return res.data.results;
}

export default getPopularPosts;