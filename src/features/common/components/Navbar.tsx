
import Image from "next/image";
import Link from "next/link";
import Search from "@/features/search/components/Search";
import { auth } from "../../../app/api/auth/[...nextauth]/route";
import { BiPlus } from "react-icons/bi";
import Notifications from "@/features/notifications/components/Notifications";
import getNotifications from "@/lib/getNotifications";
import ChatsButton from "@/features/chats/components/ChatsButton";
import HeaderAvatar from "./HeaderAvatar";
import getChats from "@/lib/getChats";

export default async function Navbar() {
    const session = await auth();
    let chats: Chat[] = [];
    let notifications: NotificationType[] = [];
    if (session) {
        [chats, notifications] = await Promise.all([
            getChats(),
            getNotifications()
        ]);
    }

    return (
        <nav className="py-3 border-b-[1px] border-secondary fixed w-full left-0 top-0 z-20 bg-white">
            <div className="container gap-5 flex items-center justify-between">
                <Link href={"/"}>
                    <Image alt="Threaddit Logo" priority src="/images/logo.png" width={100} height={100} />
                </Link>
                <Search />
                {
                    session?.user ? (
                        <div className="flex items-center gap-4">
                            <ChatsButton initialData={chats} />
                            <Notifications notificationsData={notifications} />
                            <Link className="text-lg items-center px-3 py-2 hover:bg-secondary duration-300 rounded-3xl font-semibold text-gray-500 flex justify-center gap-3" href={"/create-post"}>
                                <span>
                                    <BiPlus className="text-2xl" />
                                </span>
                                <p>Create</p>
                            </Link>
                            <HeaderAvatar />
                        </div>
                    )
                    :
                    (
                        <Link
                            href={"/signin"}
                            className="py-3 rounded-3xl px-6 bg-primary font-semibold text-white"
                        >
                            Login
                        </Link>
                    )
                }
            </div>
        </nav>
    );
}