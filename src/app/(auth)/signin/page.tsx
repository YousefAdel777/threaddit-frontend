import GithubButton from "@/features/auth/components/GithubButton"
import GoogleButton from "@/features/auth/components/GoogleButton"
import LoginForm from "@/features/auth/components/LoginForm";

export default async function SignIn() {

    return (
        <section className="py-14 min-h-[calc(100svh_-_5rem)] bg-ternary">
            <div className="container">
                <div className="bg-white py-6 px-6 lg:px-20 mx-auto rounded-lg max-w-lg shadow-xl">
                    <h1 className="text-[1.75rem] text-center font-bold mb-6">Sign In</h1>
                    <GoogleButton />
                    <GithubButton />
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <hr className="border-ternary w-full" />
                        <p className="text-center">or</p>
                        <hr className="border-ternary w-full" />
                    </div>
                    <LoginForm />
                </div>
            </div>
        </section>
    )
}
