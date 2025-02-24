import ProfileHeader from "@/features/users/components/ProfileHeader";
import UserDetails from "@/features/users/components/UserDetails";
import getUser from "@/lib/getUser";
import { notFound } from "next/navigation";

export default async function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ userId: string }> }) {
    const userId = (await params).userId;
    const user = await getUser(Number(userId));

    if (!user.id) {
        notFound();
    }

    return (
        <div className="pt-4 pl-10">
            <div className="flex flex-col-reverse items-start gap-2 lg:flex-row">
                <div className="lg:w-2/3">
                    <ProfileHeader userId={user.id} {...user} />
                    {children}
                </div>
                <UserDetails {...user} />
            </div>
        </div>
    );
}