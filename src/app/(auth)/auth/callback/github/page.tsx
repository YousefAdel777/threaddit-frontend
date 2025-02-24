import AuthCallback from "@/features/auth/components/AuthCallback";
import { loginWithGithub } from "@/lib/actions";
import { redirect } from "next/navigation";

const GithubAuthCallback = async ({ searchParams }: { searchParams: Promise<{ code: string }> }) => {
    const { code } = await searchParams;

    if (!code) {
        redirect("/");
    }

    return (
        <AuthCallback loginWithProvider={loginWithGithub} code={code} />
    )
}

export default GithubAuthCallback;