"use client"

import dynamic from "next/dynamic";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/features/common/components/Button";
import { KeyedMutator } from "swr";
import { updateCommentMutation, updateCommentOptions } from "@/lib/mutations";
const Editor = dynamic(() => import('@/features/common/components/Editor'), { ssr: false });

const commentSchema = z.object({
    content: z.string().min(1, { message: "Comment is required" }),
});

type SchemaProps = z.infer<typeof commentSchema>;

type Props = {
    id: number,
    content: string,
    comments: CommentType[],
    mutate: KeyedMutator<unknown>,
    closeEditForm: () => void
}

const CommentEditForm = ({ id, content, comments, mutate, closeEditForm }: Props) => {
    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SchemaProps>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: content,
        }
    })

    const onSubmit = async (data: SchemaProps) => {
        await mutate(
            updateCommentMutation(id, { content: data.content }, comments),
            updateCommentOptions(id, { content: data.content }, comments),
        )
        setValue("content", "");
        closeEditForm();
    }

    return (
        <div className="mb-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Editor markdown={watch("content")} onChange={(value) => setValue("content", value)} />
                <p className={`error ${errors.content ? "opacity-100" : ""}`}>
                    {errors.content?.message}
                </p>
                <div className="mt-4 flex items-center justify-end">
                    <Button className="mr-3" onClick={closeEditForm}>
                        Cancel
                    </Button>
                    <Button>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CommentEditForm;