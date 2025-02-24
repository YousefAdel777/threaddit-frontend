import api from "./apiAxios"

const getNotifications = async () => {
    try {
        const res = await api.get("/api/notifications");
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export default getNotifications;