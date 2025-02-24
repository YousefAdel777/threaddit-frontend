import { createCommunity, updateCommunity } from "@/lib/actions";
import getTopics from "@/lib/getTopics";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import { z } from "zod";
import CommunityImageDropzone from "./CommunityImageDropzone";
import Select, { MultiValue } from "react-select";
import CommunityCard from "./CommunityCard";
import Button from "@/features/common/components/Button";
import CropModal from "@/features/common/components/CropModal";

type Props = {
    community?: Community;
    closeModal: () => void;
}

const fileTypes: Readonly<string[]> = ["image/png", "image/jpeg", "image/jpg"]

const communitySchema = z.object({
    name: z.string().min(1, { message: "Community name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    banner: z.instanceof(File).optional().refine(file => file ? fileTypes.includes(file?.type) : true, { message: "File must be an PNG, JPG or JPEG" })
    .refine(file => file ? file?.size <= 3 * 1024 * 1024 : true, { message: "File must be less than 3MB" }),
    icon: z.instanceof(File).optional().refine(file => file ? fileTypes.includes(file?.type) : true, { message: "File must be an PNG, JPG or JPEG" })
    .refine(file => file ? file?.size <= 3 * 1024 * 1024 : true, { message: "File must be less than 3MB" }),
    topics: z.number().array().min(1, { message: "Topics are required" }).max(3, { message: "You can only select up to 3 topics" }),
});

type SchemaProps = z.infer<typeof communitySchema>;

const CommunityForm = ({ community, closeModal }: Props) => {

    const router = useRouter();
    const [isPending, startTransiton] = useTransition();
    const [errorMessage, setErrorMessage] = useState("");
    const [showBanneerCrop, setShowBannerCrop] = useState(false);
    const [showIconCrop, setShowIconCrop] = useState(false);
    const [banner, setBanner] = useState<File | null>(null);
    const [icon, setIcon] = useState<File | null>(null);
    const [croppedBanner, setCroppedBanner] = useState(community?.banner || "");
    const [croppedIcon, setCroppedIcon] = useState(community?.icon || "");
    const { data: topics } = useSWR("/api/topics", getTopics);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm<SchemaProps>({
        resolver: zodResolver(communitySchema),
        defaultValues: {
            name: community?.name || "",
            description: community?.description || "",
            topics: community ? community.topics.map((topic) => topic.id) : [],
        }
    })



    const onSubmit = async (data: SchemaProps) => {
        setErrorMessage("");
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        if (data.banner) {
            formData.append("banner", data.banner);
        }
        if (data.icon) {
            formData.append("icon", data.icon);
        }
        for (const topic of data.topics) {
            formData.append("topics", String(topic));
        }
        startTransiton(async () => {
            let res;
            if (community) {
                res = await updateCommunity(community.id, formData);
            }
            else {
                res = await createCommunity(formData);
            }
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                closeModal();
                mutate("/api/communities");
                mutate("/api/user/communities");
                router.push(`/communities/${res.id}`);
            }
        });
    }    


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex mb-6 text-sm gap-5 flex-col lg:flex-row">
                        <div className="flex-1">
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Community name"
                                className="w-full mb-2 rounded-lg py-3 px-4 bg-ternary outline-none"
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.name && "opacity-100"}`}>
                                {errors.name?.message}
                            </p>
                            <textarea
                                {...register("description")}
                                placeholder="Description"
                                className="resize-none mb-2 rounded-lg py-3 px-4 bg-ternary outline-none h-32 w-full"
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.description && "opacity-100"}`}>
                                {errors.description?.message}
                            </p>
                        </div>
                        <div className="flex-1">
                            <CommunityImageDropzone 
                                onDrop={(acceptedFiles) => {
                                    setBanner(acceptedFiles[0])
                                    setShowBannerCrop(true)
                                }} 
                                fieldName="Banner" onError={() => setErrorMessage("Image must be PNG, JPG or JPEG")}
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.banner && "opacity-100"}`}>
                                {errors.banner?.message}
                            </p>
                            <CommunityImageDropzone 
                                onDrop={(acceptedFiles) => {
                                    setIcon(acceptedFiles[0])
                                    setShowIconCrop(true)
                                }}
                                fieldName="Icon" 
                                onError={() => setErrorMessage("Image must be PNG, JPG or JPEG")} 
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.icon && "opacity-100"}`}>
                                {errors.icon?.message}
                            </p>
                            <Select instanceId="ract-select"
                                className="mb-2"
                                placeholder="Topics"
                                isSearchable={true} 
                                isMulti={true}
                                value={topics?.filter((topic: Topic) => watch("topics").includes(topic.id)).map((topic: Topic) => ({ label: topic.name, value: topic.id }))}
                                options={topics?.map((topic: Topic) => ({ label: topic.name, value: topic.id }))} 
                                onChange={(val: MultiValue<Option<number>>) => setValue("topics", val.map((topic) => topic.value))} 
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.topics && "opacity-100"}`}>
                                {errors.topics?.message}
                            </p>
                        </div>
                        <div className="flex-1 w-fit mx-auto lg:m-0">
                            <CommunityCard name={watch("name")} description={watch("description")} banner={croppedBanner} icon={croppedIcon} />
                        </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-red-500 mb-2 text-sm italic font-bold duration-150">
                                {errorMessage}
                            </p>
                            <Button disabled={isPending}>
                                {community ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                {
                    showBanneerCrop && 
                    <CropModal 
                        closeModal={() => setShowBannerCrop(false)} 
                        onCrop={(file) => {
                            setValue("banner", file)                            
                            setCroppedBanner(URL.createObjectURL(file))
                        }}
                        aspect={1028 / 128}
                        image={URL.createObjectURL(banner as File)}
                        heading="Style your community"
                    />
                }
                {
                    showIconCrop && 
                    <CropModal 
                        closeModal={() => setShowIconCrop(false)} 
                        onCrop={(file) => {
                            setValue("icon", file)
                            setCroppedIcon(URL.createObjectURL(file))
                        }} 
                        aspect={1} 
                        image={URL.createObjectURL(icon as File)}
                        heading="Style your community"
                        cropShape="round"
                    />
                }
        </>
    )
}

export default CommunityForm;