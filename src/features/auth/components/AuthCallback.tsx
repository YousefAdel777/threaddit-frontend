"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    code: string,
    loginWithProvider: (code: string) => Promise<{ error: string } | void>
}

const AuthCallback = ({ code, loginWithProvider }: Props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    useEffect(() => {
        const handleLogin = async () => {
            const { error } = await loginWithProvider(code);
            if (error) {
                setErrorMessage(error);
            }
            else {
                router.refresh();
                router.push("/");
            }
        }
        if (code) {
            handleLogin();
        }
    }, [code, loginWithProvider, router]);

    if (errorMessage) {
        return (
            <h1 className="mt-6 font-semibold text-center text-2xl">{errorMessage}</h1>
        )
    }
}

export default AuthCallback;