import Image from "next/image";
import Link from "next/link";

type Props = {
    id?: number;
    name: string;
    icon: string | null;
    banner: string | null;
    description: string | null;
    members_count?: number;
}

export default function CommunityCard({ id, name, icon, banner, description, members_count }: Props) {
    const cardContent = (
        <div className="bg-white shadow-lg rounded-md overflow-hidden border-2 border-secondary">
            {
                banner ?
                <Image className="h-8 object-contain w-full" width={1000} height={32} src={banner} alt={`${name || ""} banner`} />
                :
                <div className="w-full h-8 bg-primary opacity-30" />
            }
            <div className="flex py-5 px-3 items-center gap-4">
                <Image className="h-12 w-12 object-contain rounded-full" width={48} height={48} src={icon || "/images/community_image.webp"} alt={`${name || ""} icon`} />
                <div className="grid">
                    <h3 className="text-lg font-semibold text-ellipsis text-nowrap overflow-hidden">t/{name || "communityname"}</h3>
                    <p className="text-ellipsis text-sm text-nowrap overflow-hidden">
                        {description || "Your community description"}
                    </p>
                    {
                        id &&
                        <p className="text-xs">
                            {members_count} {members_count === 1 ? "member" : "members"}
                        </p>
                    }
                </div>
            </div>
        </div>
    )

    return id ? (
        <Link href={`/communities/${id}`} className="w-full">
            {cardContent}
        </Link>
    )
    :
    (
        <>
            {cardContent}
        </>
    )
}