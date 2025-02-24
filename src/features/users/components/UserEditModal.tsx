"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/features/common/components/Button";
import React, { useState, useTransition } from "react";
import { FaX } from "react-icons/fa6";
import Dropzone from "react-dropzone";
import Image from "next/image";
import CropModal from "@/features/common/components/CropModal";
import { updateUser } from "@/lib/actions";
import { RiImageAddLine } from "react-icons/ri";
import { deleteAccount } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const fileTypes: Readonly<string[]> = ["image/png", "image/jpeg", "image/jpg"]

const userSettingsObject = z.object({
    image: z.instanceof(File).optional().refine(file => file ? fileTypes.includes(file?.type) : true, { message: "File must be an PNG, JPG or JPEG" })
    .refine(file => file ? file?.size <= 3 * 1024 * 1024 : true, { message: "File must be less than 3MB" }),
    username: z.string().min(1, { message: "Username is required" }).regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, hyphens, and underscores" }),
    bio: z.string().optional(),
})

type SchemaProps = z.infer<typeof userSettingsObject>

type Props = {
    image: string | null;
    username: string;
    bio: string;
    closeModal: () => void;
}

export default function UserSettingsModal({ username, bio, image, closeModal }: Props) {
    const [showCropModal, setShowCropModal] = useState(false);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SchemaProps>({
        resolver: zodResolver(userSettingsObject),
        defaultValues: {
            username,
            bio,
        }
    });

    const onSubmit = (data: SchemaProps) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("bio", data.bio || "");
            if (data.image) {
                formData.append("image", data.image);
            }
            const res = await updateUser(formData);
            if (res.error) {
                setErrorMessage(res.error);
            }
        });
    }

    const handleDelete = async () => {
        startTransition(async () => {
            const res = await deleteAccount();
            if (res.error) {
                setErrorMessage(res.error);
            }
            else {
                await signOut();
                router.push("/");
            }
        });
    }

    return (
        <div className="flex items-center justify-center fixed z-20 top-0 left-0 w-full h-full bg-black bg-opacity-30">
            <div className="container">
                {
                    showCropModal && newImage &&
                    <CropModal
                        image={URL.createObjectURL(newImage)}
                        aspect={1 / 1}
                        heading="Crop Image"
                        cropShape="round"
                        closeModal={() => {
                            setShowCropModal(false);
                        }}
                        onCrop={(image) => {
                            setValue("image", image);
                            setNewImage(image);
                        }}
                    />
                }
                <div className="bg-white relative p-5 rounded-lg animate-fade-in lg:mx-auto lg:max-w-3xl">
                    <span onClick={closeModal} className="cursor-pointer absolute right-4 top-4 text-xl p-3 rounded-full hover:bg-secondary hover:bg-opacity-30 duration-200">
                        <FaX className="text-xl" />
                    </span>
                    <h1 className="text-2xl font-bold mb-4">User Info</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex items-center justify-center flex-col gap-2">
                            <Dropzone 
                                onDrop={(acceptedFiles) => {
                                    setNewImage(acceptedFiles[0]);
                                    setShowCropModal(true);
                                }}
                                maxFiles={1}
                                maxSize={3 * 1024 * 1024}
                                accept={{
                                    'image/jpeg': ['.jpeg', '.jpg'],
                                    'image/png': ['.png'],
                                }}
                                multiple={false}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <div
                                        {...getRootProps()}
                                        className="relative cursor-pointer mb-5"
                                    >
                                        <input
                                            type="file"
                                            accept={fileTypes.join(",")}
                                            {...getInputProps()}
                                        />
                                        <Image
                                            width={100}
                                            height={100}
                                            src={newImage && URL.createObjectURL(newImage) || image || "/images/user_image.webp"}
                                            alt="User profile image"
                                            className="rounded-full mx-auto"
                                        />
                                        <span className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center rounded-full duration-200 bg-secondary hover:bg-ternary">
                                            <RiImageAddLine className="text-lg text-primary" />
                                        </span>
                                    </div>
                                )}
                            </Dropzone>
                            <input
                                type="text"
                                {...register("username")}
                                placeholder="Username"
                                className="form-input"
                            />
                            {
                                errors.username &&
                                <p className={`error ${errors.username ? "opacity-100" : ""}`}>{errors.username.message}</p>
                            }
                            <textarea
                                {...register("bio")}
                                placeholder="Bio"
                                className="form-input resize-none h-48"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <p className={`error ${errorMessage ? "opacity-100" : ""}`}>
                                {errorMessage}
                            </p>
                            <div>
                                <Button 
                                    className="bg-red-500 hover:bg-red-700 mr-3" 
                                    disabled={isPending}
                                    onClick={handleDelete}
                                >
                                    Delete Account
                                </Button>
                                <Button disabled={isPending}>
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}