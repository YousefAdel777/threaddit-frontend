import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

const GoogleButton = async () => {    
    return (
        <div>
            <Link
                href={`https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3000/auth/callback/google&prompt=consent&response_type=code&client_id=${process.env.GOOGLE_ID}&scope=openid%20email%20profile&access_type=offline`}
                className="w-full border-ternary mb-4 border-2 rounded-3xl bg-white hover:bg-ternary duration-300 flex items-center py-2 px-5"
            >
                <FaGoogle className="text-3xl text-primary" />
                <span className="font-medium text-sm flex-1 text-center">Continue with Google</span>
            </Link>
        </div>
    );
}

export default GoogleButton;