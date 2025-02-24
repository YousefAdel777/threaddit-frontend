import api from "./apiAxios";

const getChatMessages = async (chatId: number, per_page?: number, page?: number) => {
    const res = await api.get(`/api/messages?chat=${chatId}&page=${page || ""}&per_page=${per_page || ""}`);
    return res.data.results;
}

export default getChatMessages;