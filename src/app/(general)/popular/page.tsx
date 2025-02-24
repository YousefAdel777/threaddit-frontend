import RecentPosts from "@/features/posts/components/RecentPosts";

const Popular = async () => {
    return (
        <section className="flex items-start gap-6">
            <Popular />
            <RecentPosts />
        </section>
    );
}

export default Popular;