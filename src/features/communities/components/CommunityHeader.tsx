import Image from "next/image";
import Button from "@/features/common/components/Button";
import { createFavorite, createMember, deleteFavorite, deleteMember } from "@/lib/actions";
import FavButton from "@/features/common/components/FavButton";
import NavLink from "@/features/common/components/NavLink";

type Props = {
    id: number;
    name: string;
    favorite_id?: number;
    member_id?: number;
    banner?: string;
    icon?: string;
    is_creator: boolean;
    is_moderator: boolean;
}

export default async function CommunityHeader({ id, favorite_id, is_creator, member_id, banner, icon, name, is_moderator } : Props) {

    const handleFavorite = async () => {
        "use server"
        if (favorite_id) {
            await deleteFavorite(favorite_id);
        }
        else {
            await createFavorite({ community: id })
        }
    }

    return (
        <section>
            <div className="mb-4">
                {
                    banner ?
                    <Image src={banner} alt={`${name} banner`} width={1200} height={300} className="h-20 rounded-md" />
                    :
                    <div className="h-20 bg-primary rounded-md"/>
                }
            </div>
            <div className="flex justify-between">
                <div className="flex gap-5">
                    <Image alt={`${name} icon`} src={icon || "/images/community_image.webp"} width={100} height={100} className="rounded-full relative bottom-16 left-4 z-10" />
                    <h1 className="text-3xl font-bold">t/{name}</h1>
                </div>
                <div className="flex items-start gap-3 px-4">
                    {
                        !is_creator &&
                        <form action={async () => {
                            "use server"
                            if (member_id) {
                                await deleteMember(member_id);
                            }
                            else {
                                await createMember(id);
                            }
                        }}>
                            <Button>
                                {member_id ? "Joined" : "Join"}
                            </Button>
                        </form>
                    }
                    <form action={handleFavorite}>
                        <div className="mt-1">
                            <FavButton is_favorite={!!favorite_id} />
                        </div>
                    </form>
                </div>
            </div>
            {
                is_moderator &&
                <div className="flex items-center gap-4">
                    <NavLink className="header-link" href={`/communities/${id}`}>
                        Posts
                    </NavLink>
                    <NavLink className="header-link" href={`/communities/${id}/pending`}>
                        Pending
                    </NavLink>
                    <NavLink className="header-link" href={`/communities/${id}/removed`}>
                        Removed
                    </NavLink>
                    <NavLink className="header-link" href={`/communities/${id}/members`}>
                        Members
                    </NavLink>
                    <NavLink className="header-link" href={`/communities/${id}/rules`}>
                        Rules
                    </NavLink>
                    <NavLink className="header-link" href={`/communities/${id}/reports`}>
                        Reports
                    </NavLink>
                </div>
            }
        </section>
    );
}