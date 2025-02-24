import SearchPosts from "@/features/search/components/SearchPosts";
import SearchCommunities from "@/features/search/components/SearchCommunities";
import NavLink from "@/features/common/components/NavLink";
import SearchUsers from "@/features/search/components/SearchUsers";

export default async function Search({ searchParams }: { searchParams: Promise<{ q: string, type: string }> }) {
    const { q, type } = await searchParams;
    
    return (
        <section>
            <div className="flex items-center py-3 border-b-[1px] border-secondary mb-4 gap-4">
                <NavLink isActive={type !== "communities" && type !== "users"} className="text-sm px-3 py-2 rounded-3xl duration-200 hover:underline hover:bg-ternary" href={`/search?q=${q}&type=posts`}>
                    Posts
                </NavLink>
                <NavLink isActive={type === "communities"} className="text-sm px-3 py-2 rounded-3xl duration-200 hover:underline hover:bg-ternary" href={`/search?q=${q}&type=communities`}>
                    Communities
                </NavLink>
                <NavLink isActive={type === "users"} className="text-sm px-3 py-2 rounded-3xl duration-200 hover:underline hover:bg-ternary" href={`search?q=${q}&type=users`}>
                    Users
                </NavLink>
            </div>
            {
                type === "communities" ?
                    <SearchCommunities query={q} />
                :
                type === "users" ?
                    <SearchUsers query={q} />
                :
                <SearchPosts query={q} />
            }
        </section>
    );
}