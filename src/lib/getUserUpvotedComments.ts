import api from "./apiAxios";

export default async function getUserUpvotedComments(perPage?: number, page?: number) {
    const res = await api.get(`/api/user/upvoted-comments?per_page=${perPage || 10}&page=${page || 1}`);
    return res.data.results;
}