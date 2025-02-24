import Feed from "@/features/posts/components/Feed";
import RecentPosts from "@/features/posts/components/RecentPosts";

const Home = async () => {
  return (
    <section className="flex items-start gap-6">
      <Feed />
      <RecentPosts />
    </section>
  );
}

export default Home;