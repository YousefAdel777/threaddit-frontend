"use server";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function createUser(data: {username: string, password: string, email: string}) {
    // try {
    //     const res = await api.post('/auth/users/', data)

    //     if (res.status !== 201) {
    //         throw new Error('Failed to create user');
    //     }

    //     return res.data;
    // } catch (error) {
    //     console.log(error);
    // }
    const res = await fetch(`${BASE_URL}/auth/users/`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        return { error: "Failed to create user" };
    }
    return res.json();
}