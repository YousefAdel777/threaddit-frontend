import PostForm from "@/features/posts/components/PostForm";


export default async function CreatePost() {
    return (
        <section className="w-2/4 mx-auto p-5">
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>
            <PostForm />
        </section>
    )
}