"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo } from "react";
import { BiBell } from "react-icons/bi";
import Notification from "./Notification";

const Notifications = ({ notificationsData }: { notificationsData: NotificationType[] }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>(notificationsData);
    const { data: session } = useSession();
    const unreadNotificationsCount = useMemo(() => notifications?.filter(notification => !notification.is_read).length, [notifications]);

    useEffect(() => {
        setNotifications(notificationsData)
    }, [notificationsData]);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/notifications?token=${session?.accessToken}`);
        ws.onmessage = (event: MessageEvent) => {
            console.log(event.data);
            const notification = JSON.parse(event.data).notification;
            setNotifications((prevState) => [notification, ...prevState])
        }

        ws.onerror = (error) => {
            console.log(error);
        }

        return () => ws.close();
    }, [session?.accessToken]);

    return (
        <div className="relative">
            <button 
                onFocus={() => setShowNotifications(true)} 
                onBlur={() => setShowNotifications(false)} 
                className="rounded-full relative text-gray-500 flex items-center justify-center hover:bg-secondary duration-200 w-10 h-10"
            >
                {
                    unreadNotificationsCount > 0 &&
                    <span className="font-semibold bg-red-600 text-white text-sm w-4 h-4 rounded-full absolute right-1 top-1 flex items-center justify-center">
                        {unreadNotificationsCount}
                    </span>
                }
                <BiBell className="text-2xl" />
            </button>
            {
                showNotifications &&
                <div onMouseDown={e => e.preventDefault()} className="bg-white absolute left-1/2 -translate-x-1/2 top-full rounded-lg border-2 border-secondary py-4 max-h-96 w-80 overflow-y-auto">
                    {
                        notifications.length === 0 ?
                        <h2 className="font-semibold text-center text-xl my-4">
                            No new notifications.
                        </h2>
                        :
                        <div className="divid-y-[1px] divide-secondary">
                            {
                                notifications.map(notification => {
                                    return (
                                        <Notification key={notification.id} notification={notification} />
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Notifications;