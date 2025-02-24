import { headers } from "next/headers";
import api from "./apiAxios";

const getOAuthUrl = async (backend: string) => {
    const host = headers().get('host');
    const protocol = headers().get('x-forwarded-proto') || 'http';
    const currentUrl = `${protocol}://${host}`;
    const res = await api.get(`/auth/social/o/${backend}/?redirect_uri=${currentUrl}/callback`);
    return res.data;
}

export default getOAuthUrl;