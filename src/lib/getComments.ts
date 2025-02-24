import axios from "axios";

export default async function getComments() {
    const res = await axios.get('/api/comments');
    return res.data;
}