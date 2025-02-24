import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const GithubButton = async () => {
    return (
        <div>
            <Link
                href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_ID}&redirect_uri=http://localhost:3000/auth/callback/github`}
                className="w-full border-ternary mb-4 border-2 rounded-3xl bg-white hover:bg-ternary duration-300 flex items-center py-2 px-5"
            >
                <FaGithub className="text-3xl text-primary" />
                <span className="font-medium text-sm flex-1 text-center">Continue with Github</span>
            </Link>
        </div>
    );
}

export default GithubButton;