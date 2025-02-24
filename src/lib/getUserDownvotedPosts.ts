import api from "./apiAxios";

export default async function getUserDownvotedPosts(perPage?: number, page?: number) {
    const res = await api.get(`/api/user/downvoted-posts?per_page=${perPage || ""}&page=${page || 1}`);
    return res.data.results;
}