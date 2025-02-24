"use client"

import { createCommunity } from "@/lib/actions";
import { useState, useTransition } from "react";
import { FaX } from "react-icons/fa6";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Select, { MultiValue } from "react-select";
import useSWR from "swr";
import getTopics from "@/lib/getTopics";
import CommunityImageDropzone from "./CommunityImageDropzone";
import CropModal from "@/features/common/components/CropModal";
import { mutate } from "swr";
import CommunityCard from "./CommunityCard";
import Button from "../../common/components/Button";

const fileTypes: Readonly<string[]> = ["image/png", "image/jpeg", "image/jpg"]

const communitySchema = z.object({
    name: z.string().min(1, { message: "Community name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    banner: z.instanceof(File).optional().refine(file => file ? fileTypes.includes(file?.type) : true, { message: "File must be an PNG, JPG or JPEG" })
    .refine(file => file ? file?.size <= 3 * 1024 * 1024 : true, { message: "File must be less than 3MB" }),
    icon: z.instanceof(File).optional().refine(file => file ? fileTypes.includes(file?.type) : true, { message: "File must be an PNG, JPG or JPEG" })
    .refine(file => file ? file?.size <= 3 * 1024 * 1024 : true, { message: "File must be less than 3MB" }),
    topics: z.string().array().min(1, { message: "Topics are required" }).max(3, { message: "You can only select up to 3 topics" }),
});

type SchemaProps = z.infer<typeof communitySchema>

export default function CommunityModal({ closeModal }: { closeModal: () => void }) {

    const router = useRouter();
    const [isPending, startTransiton] = useTransition();
    const [errorMessage, setErrorMessage] = useState("");
    const [showBanneerCrop, setShowBannerCrop] = useState(false);
    const [showIconCrop, setShowIconCrop] = useState(false);
    const [banner, setBanner] = useState<File | null>(null);
    const [icon, setIcon] = useState<File | null>(null);
    const [croppedBanner, setCroppedBanner] = useState("");
    const [croppedIcon, setCroppedIcon] = useState("");
    const { data: topics } = useSWR("api/topics", getTopics);

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
    } = useForm<SchemaProps>({
        resolver: zodResolver(communitySchema),
        defaultValues: {
            topics: [],
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
            formData.append("topics", topic);
        }
        startTransiton(async () => {
            const res = await createCommunity(formData);
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
        <div className="fixed z-20 bottom-0 bg-black/20 h-full w-full left-0 top-0 flex items-center justify-center">
            <div className="w-full lg:container">
                <div className="bg-white w-full animate-fade-in rounded-lg relative px-8 py-6 max-h-svh overflow-y-auto lg:max-h-none lg:mx-auto lg:max-w-4xl">
                    <span onClick={closeModal} className="cursor-pointer absolute right-4 top-4 text-xl text-gray-500 p-4 rounded-full hover:bg-secondary hover:bg-opacity-30 duration-200">
                        <FaX />
                    </span>
                    <h2 className="text-2xl font-bold mb-1">Tell us about your community</h2>
                    <p className="text-sm mb-4">
                        A name and description help people understand what your community is all about.
                    </p>
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
                                options={topics?.map((topic: Topic) => ({ label: topic.name, value: String(topic.id) }))} 
                                onChange={(val: MultiValue<Option<string>>) => setValue("topics", val.map((topic) => topic.value))} 
                            />
                            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.topics && "opacity-100"}`}>
                                {errors.topics?.message}
                            </p>
                        </div>
                        <div className="flex-1 w-fit mx-auto lg:m-0">
                            {/* <div className="bg-white shadow-lg rounded-md overflow-hidden">
                                {
                                    croppedBanner ?
                                    <Image className="h-8 object-contain w-full" width={32} height={32} src={URL.createObjectURL(getValues("banner") as File)} alt={"banner"} />
                                    :
                                    <div className="w-full h-8 bg-primary opacity-30" />
                                }
                                <div className="flex py-5 px-3 items-center gap-4">
                                    {
                                        croppedIcon ?
                                        <Image className="h-12 w-12 object-contain rounded-full" width={48} height={48} src={croppedIcon} alt={"icon"} />
                                        :
                                        <Image className="h-12 w-12 rounded-full" width={48} height={48} src="/images/community_image.webp" alt="icon" />
                                    }
                                    <div>
                                        <h3 className="text-lg mb-1 font-semibold">t/{watch("name") || "communityname"}</h3>
                                        <p className=" text-ellipsis">
                                            {watch("description") || "Your community description"}
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                            <CommunityCard name={watch("name")} description={watch("description")} banner={croppedBanner} icon={croppedIcon} />
                        </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-red-500 mb-2 text-sm italic font-bold duration-150">
                                {errorMessage}
                            </p>
                            <Button disabled={isPending}>
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
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
            </div>
        </div>
    );
}