"use client"

import Select from "react-select";
import { useState, useTransition, Suspense, useMemo } from "react";
import useSWR from "swr";
import getUserCommunities from "@/lib/getUserCommunities";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/features/common/components/Button";
import { createPost } from "@/lib/actions";
import dynamic from "next/dynamic";
import PostDropzone from "./PostDropzone";
import LinkPreview from "./LinkPreview";
import Switch from "@/features/common/components/Switch";
import PostType from "@/features/posts/components/PostType";
import postSchema from "@/lib/validation/postSchema";
const Editor = dynamic(() => import('@/features/common/components/Editor'), { ssr: false });

type SchemaProps = z.infer<typeof postSchema>;

export default function PostForm() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();
    const { data: communities } = useSWR('/api/user/communities', getUserCommunities);
    const communitiesOptions: Option<number>[] = useMemo(() => {
        return communities?.map((community: Community) => ({
            value: community.id,
            label: `t/${community.name}`
        }))
    }, [communities]);
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        watch,
        // setError,
    } = useForm<SchemaProps>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            type: "text",
            // media: [],
            is_nsfw: false,
            is_spoiler: false,
        }
    });
    const postType = watch("type");

    const onSubmit = (data: SchemaProps) => {
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
        if (data.community) {
            formData.append("community", String(data.community));
        }
        startTransition(async () => {
            const res = await createPost(formData);
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                router.push(`posts/${res.id}/`);
            }
        });
    }    

    return (
        <section>
            <Select instanceId="ract-select"
                options={communitiesOptions}
                placeholder="Community"
                isSearchable={true}
                isClearable={true}
                className="mb-2 w-60 z-10"
                value={communitiesOptions?.find(option => option.value === watch("community"))}
                onChange={option => setValue("community", option?.value)}
            />
            {
                <p className={`error ${errors.community ? "opacity-100" : "opacity-0"}`}>
                    {errors.community?.message}
                </p>
            }
            <div className="flex mb-4 items-center text-sm">
                <PostType type="Text" onClick={() => setValue("type", "text")} isActive={postType === "text"} />
                <PostType type="Images & Videos" onClick={() => setValue("type", "media")} isActive={postType === "media"} />
                <PostType type="Link" onClick={() => setValue("type", "link")}  isActive={postType === "link"} />
                <PostType type="poll" onClick={() => setValue("type", "poll")} isActive={postType === "poll"} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder="Title"
                    className="form-input mb-2"
                    {...register("title")}
                />
                <p className={`error ${errors.title ? "opacity-100" : ""}`}>
                    {errors.title?.message}
                </p>
                <div className="flex items-center gap-6 mb-3">
                    <div className="flex text-sm font-semibold items-center gap-3">
                        <span>
                            Spoiler
                        </span>
                        <Switch checked={watch("is_spoiler")} onChange={e => setValue("is_spoiler", e.target.checked)} />
                    </div>
                    <div className="flex text-sm font-semibold items-center gap-3">
                        <span>
                            NSFW
                        </span>
                        <Switch checked={watch("is_nsfw")} onChange={e => setValue("is_nsfw", e.target.checked)} />
                    </div>
                </div>
                {
                    postType === "media" ?
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
                    postType === "link" ?
                    <>
                        <input 
                            type="text"
                            {...register("link")}
                            placeholder="Link URL"
                            className="form-input mb-2"
                            autoComplete="off"
                        />
                        {
                            "link" in errors &&
                            <p className={`error ${errors.link ? "opacity-100" : ""}`}>
                                {errors.link?.message}
                            </p>
                        }
                        {
                            watch("link") &&
                            <LinkPreview url={watch("link") || ""} />
                        }
                    </>
                    :
                    <Suspense fallback={null}>
                        <Editor markdown={watch("content") || ""} onChange={(val) => setValue("content", val)} />
                        {
                            "content" in errors &&
                            <p className={`error ${errors.content ? "opacity-100" : ""}`}>
                                {errors.content?.message}
                            </p>
                        }
                    </Suspense>
                }
                <div className="flex items-center justify-between">
                    <p className={`error text-sm ${errorMessage ? "opacity-100" : "opacity-0"}`}>
                        {errorMessage}
                    </p>
                    <Button disabled={isPending}>
                        Post
                    </Button>
                </div>
            </form>
        </section>
    );
}