import Image from "next/image";
import Link from "next/link";

type Props = {
    id: number;
    icon: string | null;
    name: string;
    members_count: number;
}

export default function CommunitySearchResult({ id, name, icon, members_count }: Props) {
    return (
        <Link href={`/communities/${id}`} className="flex pt-3 px-2 items-center gap-5">
            <div>
                <Image width={40} height={40} src={icon || "/images/community_image.webp"} alt={`${name} icon`} className="rounded-full" />
            </div>
            <div>
                <p className="font-semibold">t/{name}</p>
                <p className="text-xs">{members_count} members</p>
            </div>
        </Link>
    )
}