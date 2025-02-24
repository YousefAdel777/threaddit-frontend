"use client"

import { useEffect, useState, useTransition } from "react";
import MenuItem from "./MenuItem";
import Link from "next/link";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { useSession } from "next-auth/react";
import Menu from "./Menu";
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions";
import { useThemeStore } from "@/stores/themeStore";
import { IoSettings } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import UserAvatar from "@/features/users/components/UserAvatar";

const HeaderAvatar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const { setTheme, theme } = useThemeStore();

    useEffect(() => {
        const unsubscribe = useThemeStore.subscribe((state) => {
            if (state.theme === "dark") {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        });

        return () => unsubscribe();
    })

    const handleLogOut = () => {
        startTransition(async () => {
            setIsMenuOpen(false);
            const { error } = await logout();
            if (!error) {
                await signOut();
                router.push("/");
            }
        });
    }

    const toggleTheme = () => {
        if (theme === "system") {
            setTheme("light");
        } 
        else if (theme === "light") {
            setTheme("dark");
        }
        else {
            setTheme("system");
        }
    }

    return (
        <div className="relative">
            <div 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                onBlur={() => setIsMenuOpen(false)}
                className="cursor-pointer"
                tabIndex={-1}
            >
                <UserAvatar image={session?.user?.image} username={session?.user?.username} />
            </div>
            {
                isMenuOpen && 
                <Menu>
                    <MenuItem>
                        <Link className="text-sm flex items-center gap-3" href={`/users/${session?.userId}`}>
                            <FaUser className="text-primary text-lg" />
                            Profile
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={toggleTheme}>
                        {
                            theme === "system" ?
                            <IoSettings className="text-primary text-lg" />
                            :
                            theme === "light" ?
                            <RiSunFill className="text-primary text-lg" />
                            :
                            <RiMoonFill className="text-primary text-lg" />
                        }
                        <span className="text-sm">{theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}</span>
                    </MenuItem>
                    <MenuItem isDisabled={isPending} onClick={handleLogOut} className="text-red-500">
                        <BiLogOut className="text-red-500 text-lg" />
                        <span className="text-sm text-red-500">Logout</span>
                    </MenuItem>
                </Menu>
            }
        </div>
    );
}

export default HeaderAvatar;