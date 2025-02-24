"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Button from "@/features/common/components/Button"
import { useState, useTransition } from "react"
import { createRule } from "@/lib/actions"

const ruleSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    community: z.number(),
})

type SchemaProps = z.infer<typeof ruleSchema>;

type Props = {
    communityId: number;
}

export default function RuleForm({ communityId }: Props) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ruleSchema),
        defaultValues: {
            community: communityId,
            title: "",
            description: "",
        }
    })

    const onSubmit = (data: SchemaProps) => {
        startTransition(async () => {
            const res = await createRule(data);
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                setValue("description", "");
                setValue("title", ""); 
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    type="text"
                    {...register("title")}
                    className="form-input"
                    placeholder="Title"
                />
                {
                    errors.title &&
                    <p className={`error ${errors.title ? "opacity-100" : ""}`}>{errors.title.message}</p>
                }
                <textarea 
                    {...register("description")}
                    className="form-input h-60 resize-none"
                    placeholder="Description"
                />
                {
                    errors.description &&
                    <p className={`error ${errors.description ? "opacity-100" : ""}`}>{errors.description.message}</p>
                }
                <div className="my-4 flex items-center justify-between">
                    <p className={`error ${errorMessage ? "opacity-100" : ""}`}>
                        {errorMessage}
                    </p>
                    <Button disabled={isPending}>
                        Create
                    </Button>
                </div>
            </form>
        </div>
    )
}