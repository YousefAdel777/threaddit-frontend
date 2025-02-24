"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FaX } from "react-icons/fa6"
import Button from "../../features/common/components/Button"
import Switch from "../../features/common/components/Switch"
import Image from "next/image"
import { formatDateShort } from "@/lib/utils"
import { KeyedMutator } from "swr"
import { createBanMutation, createBanOptions } from "@/lib/mutations"

const banObject = z.object({
    user: z.number().int(),
    community: z.number().int(),
    reason: z.string().min(1, { message: "Reason is required" }),
    is_permanent: z.boolean().default(false),
    expires_at: z.string().nullable().transform((value) => value === "" ? null : value),
}).refine((data) => data.is_permanent || data.expires_at, {
    message: "Either an expiry date or permanent ban is required.",
    path: ["expires_at"],
});

type Props = {
    user: User;
    communityId: number,
    joined_at: string;
    members: Member[];
    closeModal: () => void;
    mutate: KeyedMutator<Member[]>;
}

type SchemaProps = z.infer<typeof banObject>;

const BanModal = ({ user, communityId, joined_at, closeModal, mutate, members }: Props) => {
    const {
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors }
    } = useForm<SchemaProps>({
        resolver: zodResolver(banObject),
        defaultValues: {
            community: communityId,
            user: user.id,
            reason: "",
            expires_at: null,
        }
    });

    const onSubmit = async (data: SchemaProps) => {  
        await mutate(
            createBanMutation(data, members),
            createBanOptions(data, members)
        );
        closeModal();
    }
    return (
        <div className="fixed z-40 left-0 top-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
            <div className="rounded-xl animate-fade-in bg-white p-5 relative w-96">
                <button onClick={closeModal} className="absolute top-3 right-3 p-4 rounded-full duration-200 hover:bg-secondary">
                    <FaX className="text-xl" />
                </button>
                <h2 className="text-xl font-bold mb-5">Ban Member</h2>
                <div className="mb-3 flex items-center gap-4">
                    <Image alt={`${user.username} profile image`} src={user.image || "/images/user_image.webp"} width={80} height={80} />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                            u/{user.username}
                        </h3>
                        <div className="text-xs space-y-1">
                            <p>
                                Post Karma: {user.post_karma}
                            </p>
                            <p>
                                Comment Karma: {user.comment_karma}
                            </p>
                            <p>
                                Joined: {formatDateShort(joined_at)}
                            </p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        {...register("reason")}
                        className="form-input h-40 resize-none"
                        placeholder="Reason"
                    />
                    {
                        errors.reason &&
                        <p className={`error ${errors.reason ? "opacity-100" : ""}`}>
                            {errors.reason.message}
                        </p>
                    }
                    <div className={`text-sm select-none ${watch("is_permanent") ? "opacity-30" : ""}`}>
                        <label className="mb-2 block" htmlFor="expires_at">
                            Expires At
                        </label>
                        <input
                            id="expires_at"
                            type="datetime-local"
                            {...register("expires_at")}
                            className={`form-input`}
                            disabled={watch("is_permanent")}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        {
                            errors.expires_at &&
                            <p className={`error ${errors.expires_at ? "opacity-100" : ""}`}>
                                {errors.expires_at.message}
                            </p>
                        }
                    </div>
                    <div className="flex my-2 items-center gap-4">
                        <p className="text-sm">
                            Permanent Ban
                        </p>
                        <Switch checked={watch("is_permanent")|| false} onChange={() => setValue("is_permanent", !watch("is_permanent"))} />
                    </div>
                    <Button className="ml-auto block">
                        Ban
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default BanModal;