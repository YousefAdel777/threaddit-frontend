import api from "./api";

export default async function getUser(userId: number): Promise<User> {
    return await api.get<User>(`/api/users/${userId}`);
}