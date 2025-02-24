import { updateNotification } from "@/lib/actions"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type Props = {
    notification: NotificationType
}

const Notification = ({ notification }: Props) => {
    const { content_type, id, created_at, message, content_object, is_read } = notification;
    let href: string;
    let notificationImage;
    let notificationContent;
    if (content_type === "post") {
        
    }
    else if (content_type === "comment") {
        href = `/comments/${content_object.id}`;
        notificationImage = content_object.user.image || "/images/user_image.webp";
        notificationContent = content_object.content;
    }
    else if (content_type === "follow") {
        console.log(content_object);
        
        href = `/users/${content_object?.user.id}`;
        notificationImage = content_object?.user.image || "/images/user_image.webp";
        notificationContent = "You have a new follower.";
    }

    return (
        <Link onClick={async () => await updateNotification(id, { is_read: true })} href={href} className={`${!is_read ? "bg-ternary" : ""} px-3 py-2 duration-200 hover:bg-secondary flex items-center gap-3`}>
            <Image src={notificationImage as string} alt="Notification image" width={40} height={40} className="rounded-full" />
            <div className="space-y-1 text-left">
                <h2 className="text-sm font-semibold">{message}</h2>
                <p className="text-xs text-nowrap text-ellipsis overflow-hidden max-w-[35ch]">
                    {notificationContent}
                </p>
                <span className="text-xs">
                    {formatDate(created_at)}
                </span>
            </div>
        </Link>
    )


}

export default Notification;