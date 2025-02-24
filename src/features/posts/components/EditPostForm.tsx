"use client";

import { updatePost } from "@/lib/actions";
import editPostSchema from "@/lib/validation/editPostSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "@/features/common/components/Button";
import LinkPreview from "./LinkPreview";
import PostDropzone from "./PostDropzone";
import Crosspost from "./Crosspost";

type Props = {
    post: Post;
}

type SchemaProps = z.infer<typeof editPostSchema>;

const EditPostForm = ({ post }: Props) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        watch,
    } = useForm<SchemaProps>({
        resolver: zodResolver(editPostSchema),
        defaultValues: {
            type: post.type,
            title: post.title,
            content: post.content,
            link: post.link,
            is_nsfw: post.is_nsfw,
            is_spoiler: post.is_spoiler,
        }
    });

    useEffect(() => {
        if (post.attachments) {
            const fetchAndSetFiles = async (attachments: string[]) => {
                const filePromises = attachments.map(async (attachment, index) => {
                    const fileExtension = attachment?.split('.').pop();
                    const response = await fetch(attachment);
                    const blob = await response.blob();
                    return new File([blob], `file_${index}.${fileExtension}`, { type: blob.type });
                });
            
                const postFiles = await Promise.all(filePromises);
                setFiles(postFiles);
                setValue("media", postFiles);
            }
            fetchAndSetFiles(post.attachments.map(attachment => attachment.file));
        }
    }, [post.attachments, setValue]);

    const onSubmit = (data: SchemaProps) => {
        setErrorMessage("");
        startTransition(async () => {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("type", data.type);
            formData.append("is_nsfw", JSON.stringify(data.is_nsfw));
            formData.append("is_spoiler", JSON.stringify(data.is_spoiler));
            if (data.type === "text" && data.content) {
                formData.append("content", data.content);
            }
            else if (data.type === "media") {
                for (const file of data.media) {
                    formData.append("attachments", file);
                }
            }
            else if (data.type === "link") {
                formData.append("link", data.link);
            }
            const res = await updatePost(post.id, formData);
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                router.push(`/posts/${post.id}`);
            }
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="Title"
                    {...register("title")}
                    placeholder="Title"
                    className="form-input"
                />
                {/* <ErrorMessage /> */}
                {
                    errors.title &&
                    <p className={`error ${errors.title ? "opacity-100" : ""}`}>
                        {errors.title.message}
                    </p>
                }
                {
                    post.type === "text" ?
                    <>
                        <textarea
                            placeholder="Content"
                            className="form-input"
                            {...register("content")}
                        />
                        {
                            "content" in errors && errors.content &&
                            <p className={`error ${errors.content ? "opacity-100" : ""}`}>
                                {errors.content.message}
                            </p>
                        }
                    </>
                    :
                    post.type === "link" ?
                    <>
                        <input
                            type="text"
                            {...register("link")}
                            placeholder="Link"
                            className="form-input"
                        />
                        {
                            "link" in errors && errors.link &&
                            <p className={`error ${errors.link ? "opacity-100" : ""}`}>
                                {errors.link.message}
                            </p>
                        }
                        <LinkPreview url={watch("link") || ""} />
                    </>
                    :
                    post.type === "media" ?
                    <>
                        <PostDropzone files={files} 
                            onDrop={(acceptedFiles) => {
                                const newFiles = [...files, ...acceptedFiles];
                                setFiles(newFiles);
                                setValue("media", newFiles);
                            }}
                            onRemove={(index) => {
                                const newFiles = files.filter((_, i) => i !== index);
                                setFiles(newFiles);
                                setValue("media", newFiles);
                            }}
                        />
                        {
                            "media" in errors &&
                            <p className={`error ${errors.media ? "opacity-100" : ""}`}>
                                {errors.media?.message}
                            </p>
                        }
                    </>
                    :
                    post.type === "crosspost" ?
                    <Crosspost {...post.original_post as Post} />
                    :
                    null
                }
                <div className="flex items-center justify-between">
                    <p className={`error ${errorMessage ? "opacity-100" : ""}`}>
                        {errorMessage}
                    </p>
                    <Button disabled={isPending}>
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default EditPostForm;