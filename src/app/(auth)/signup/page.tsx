import SignupForm from "@/features/auth/components/SignupForm";
import GoogleButton from "@/features/auth/components/GoogleButton";
import GithubButton from "@/features/auth/components/GithubButton";

export default async function Signup() {
    return (
        <section className="py-14 min-h-[calc(100svh_-_5rem)] bg-ternary">
            <div className="container">
                <div className="bg-white py-6 px-6 lg:px-20 mx-auto rounded-lg max-w-lg shadow-xl">
                    <h1 className="text-[1.75rem] text-center font-bold mb-6">Sign Up</h1>
                    <GoogleButton />
                    <GithubButton />
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <hr className="border-ternary w-full" />
                        <p className="text-center">or</p>
                        <hr className="border-ternary w-full" />
                    </div>
                    <SignupForm />
                </div>
            </div>
        </section>
    )
}