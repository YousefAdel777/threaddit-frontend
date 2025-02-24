import api from "./apiAxios";

export default async function getComments(commentId: string) {
    const res = await api.get(`/api/comments/${commentId}`);
    return res.data;
}