/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getSession } from "next-auth/react";

export const BASE_URL = "http://localhost:8000";

interface ApiOptions extends RequestInit {
    body?: any; 
}

const defaultHeaders = async (): Promise<HeadersInit> => {
    let session;
    if (typeof window === "undefined") {
        session = await auth();
    } else { 
        session = await getSession();
    }
    return {
        "Content-Type": "application/json",
        "Authorization": session?.accessToken ? `Bearer ${session.accessToken}` : "",
    };
};

const apiFetch = async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const { method = "GET", body, headers, ...rest } = options;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            ...(await defaultHeaders()), 
            ...headers 
        }, 
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    return response.json();
};

const api = {
    get: <T>(endpoint: string, options?: ApiOptions) => apiFetch<T>(endpoint, { method: "GET", ...options }),
    post: <T>(endpoint: string, body: any, options?: ApiOptions) => apiFetch<T>(endpoint, { method: "POST", body, ...options }),
    put: <T>(endpoint: string, body: any, options?: ApiOptions) => apiFetch<T>(endpoint, { method: "PUT", body, ...options }),
    patch: <T>(endpoint: string, body: any, options?: ApiOptions) => apiFetch<T>(endpoint, { method: "PATCH", body, ...options }),
    delete: <T>(endpoint: string, options?: ApiOptions) => apiFetch<T>(endpoint, { method: "DELETE", ...options }),
};

export default api;
