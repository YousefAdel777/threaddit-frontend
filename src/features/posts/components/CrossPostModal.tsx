import getPost from "@/lib/getPost";
import Modal from "@/features/common/components/Modal";
import useSWR from "swr";
import Crosspost from "./Crosspost";
import Loading from "@/features/common/components/Loading";
import getUserCommunities from "@/lib/getUserCommunities";
import Select, { SingleValue } from "react-select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState, useTransition } from "react";
import { createPost } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Button from "@/features/common/components/Button";

type Props = {
    closeModal: () => void;
    postId: number;
}

const crosspostObject = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    community: z.number().optional(),
    originalPost: z.number(),
});

type SchemaProps = z.infer<typeof crosspostObject>;

const CrossPostModal = ({ closeModal, postId }: Props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const { data: post, isLoading: isLoadingPost, error: postError } = useSWR(`/api/posts/${postId}/`, () => getPost(postId));
    const { data: communities, isLoading: isLoadingCommunities, error: communitiesError } = useSWR(`/api/user/communities/`, getUserCommunities);
    const communitiesOptions: Option<number>[] = useMemo(() => {
        return communities?.map((community: Community) => ({
            value: String(community.id),
            label: `t/${community.name}`
        }))
    }, [communities]);
    const router = useRouter();

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors }
    } = useForm<SchemaProps>({
        resolver: zodResolver(crosspostObject),
        defaultValues: {
            originalPost: postId,
        }
    });

    const onSubmit = (data: SchemaProps) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("type", "crosspost");
            formData.append("original_post", String(data.originalPost));
            formData.append("title", data.title);
            if (data.community) {
                formData.append("community", String(data.community));
            }
            const res = await createPost(formData);
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                router.push(`/posts/${res.id}`);
                closeModal();
            }
        });
    }

    return (
        <Modal closeModal={closeModal} title="Crosspost">
            <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                <Select instanceId="ract-select"
                    options={communitiesOptions}
                    onChange={(val: SingleValue<Option<number>>) =>  {
                        setValue("community", val?.value);
                    }}
                    value={communitiesOptions?.find((option) => option.value === watch("community"))}
                    isSearchable={false}
                    className="w-52 mb-4"
                    placeholder="Community"
                    isClearable={true}
                />
                <input
                    type="text"
                    {...register("title")}
                    placeholder="Title"
                    className="form-input"
                />
                {
                    errors.title &&
                    <p className={`error ${errors.title ? "opacity-100" : ""}`}>{errors.title.message}</p>
                }
                <div className="flex items-center justify-between">
                    <p className={`error ${errorMessage ? "opactit-100" : ""}`}>
                        {errorMessage}
                    </p>
                    <Button disabled={isPending}>
                        Create
                    </Button>
                </div>
            </form>
            {
                isLoadingPost || isLoadingCommunities ?
                <Loading text="Loading..." />
                :
                communitiesError || postError ?
                <h2 className="text-xl w-full text-center font-semibold">Something went wrong.</h2>
                :
                <Crosspost {...post} />
            }
        </Modal>
    )
}

export default CrossPostModal;