import getTopics from "@/lib/getTopics";
import Topic from "@/features/communities/components/Topic";

export default async function Explore() {
    const topics: Topic[] = await getTopics();
    return (
        <section>
            {
                topics.map((topic) => {
                    return (
                        <Topic key={topic.id} {...topic} />
                    )
                })
            }
        </section>
    )
}