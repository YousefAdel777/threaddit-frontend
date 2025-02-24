import AuthCallback from "@/features/auth/components/AuthCallback";
import { loginWithGoogle } from "@/lib/actions";
import { redirect } from "next/navigation";

const GoogleAuthCallback = async ({ searchParams }: { searchParams: Promise<{ code: string }> }) => {
    const { code } = await searchParams;

    if (!code) {
        redirect("/");
    }

    return (
        <AuthCallback loginWithProvider={loginWithGoogle} code={code} />
    )
}

export default GoogleAuthCallback;