
import axios from "axios";
import { getSession } from "next-auth/react";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const BASE_URL = "http://localhost:8000";

axios.defaults.baseURL = BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    } else { 
        session = await getSession();
    }

    if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// api.interceptors.response.use((response) => {
//     return response;
// }, async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         // const session = await getSession();
//         let session;
//         if (typeof window == "undefined") {
//             session = await auth();
//         }
//         else {
//             session = await getSession();
//         }
//         if (session?.refreshToken) {
//             try {
//                 const { data } = await axios.post(`${BASE_URL}/auth/jwt/refresh`, {
//                     refresh: session.refreshToken
//                 });
//                 await updateSession({ ...session, accessToken: data.access });
//                 originalRequest.headers.Authorization = `Bearer ${data.access}`;
//                 return api(originalRequest);
//             } catch (error) {
//                 return Promise.reject(error);
//             }
//         }
//     }
//     return Promise.reject(error);
// });

export default api;