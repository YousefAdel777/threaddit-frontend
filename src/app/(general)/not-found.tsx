import Image from "next/image";
import Link from "next/link";
import Button from "@/features/common/components/Button";

export default async function NotFound() {
    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <Image src={"/images/404.png"} alt="404" width={400} height={400} />
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-sm">The page you are looking for does not exist.</p>
            <Link href="/">
                <Button>
                    Go Home
                </Button>
            </Link>
        </div>
    );
}