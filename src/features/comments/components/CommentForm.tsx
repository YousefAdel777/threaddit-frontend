"use client"

import dynamic from "next/dynamic";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/features/common/components/Button";
import { KeyedMutator } from "swr";
import { addCommentMutation, addCommentOptions } from "@/lib/mutations";
import { useSession } from "next-auth/react";
const Editor = dynamic(() => import('@/features/common/components/Editor'), { ssr: false });

const commentSchema = z.object({
    content: z.string().min(1, { message: "Comment is required" }),
});

type SchemaProps = z.infer<typeof commentSchema>;

type Props = {
    postId: number;
    mutate: KeyedMutator<unknown>,
    replyToId?: number;
    comments: CommentType[],
    onComment?: () => void,
}

export default function CommentForm({ postId, replyToId, comments, mutate, onComment }: Props) {
    // const [errorMessage, setErrorMessage] = useState("");
    // const [isPending, startTransition] = useTransition();
    const { data: session } = useSession();

    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SchemaProps>({
        resolver: zodResolver(commentSchema),
    })

    const onSubmit = async (data: SchemaProps) => {
        mutate(
            addCommentMutation({ content: data.content, post: postId, parent: replyToId }, comments),
            addCommentOptions({ content: data.content, post: postId, parent: replyToId }, comments, session?.user),
        )
        if (onComment) {
            onComment();
        }
        setValue("content", "");
    }

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Editor markdown={watch("content")} onChange={(value) => setValue("content", value)} />
                <p className={`error ${errors.content ? "opacity-100" : ""}`}>
                    {errors.content?.message}
                </p>
                <div className="mt-4 flex items-center justify-end">
                    <Button>
                        {replyToId ? "Reply" : "Comment"}
                    </Button>
                </div>
            </form>
        </div>
    )
}