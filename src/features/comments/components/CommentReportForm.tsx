"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "@/features/common/components/Button";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import useSWR, { KeyedMutator } from "swr";
import Select, { SingleValue } from "react-select";
import getCommunityRules from "@/lib/getCommunityRules";
import Loading from "@/features/common/components/Loading";
import { createCommentReportMutation, createCommentReportOptions } from "@/lib/mutations";

const reportSchema = z.object({
    reason: z.string().min(1, { message: "Reason is required" }),
    violated_rule: z.number().optional(),
    comment: z.number(),
})

type Props = {
    commentId: number;
    communityId: number;
    comments: CommentType[];
    closeModal: () => void;
    mutate: KeyedMutator<unknown>;
}

type SchemaProps = z.infer<typeof reportSchema>;

export default function CommentReportForm({ commentId, communityId, comments, mutate, closeModal,  }: Props) {
    const [errorMessage, setErrorMessage] = useState("");
    const { data: rules, isLoading, error } = useSWR(["/api/rules/", communityId], () => getCommunityRules(communityId));
    const violatedRuleOptions = rules?.map((rule: Rule) => ({ label: rule.title, value: rule.id }))

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors }
    } = useForm<SchemaProps>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            comment: commentId,
        }
    })

    const onSubmit = async (data: SchemaProps) => {
        setErrorMessage("");
        await mutate(
            createCommentReportMutation(data, comments),
            createCommentReportOptions(data, comments),
        );
        closeModal();
    }    

    return (
        <div className="flex items-center z-50 justify-center fixed left-0 top-0 bg-black bg-opacity-30 w-full h-full">
            <div className="relative w-96 bg-white p-5 rounded-lg animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">
                    Report To Moderators
                </h2>
                {
                    isLoading ?
                    <Loading text="Loading..." />
                    :
                    error ?
                    <h2 className="text-center text-xl font-semibold">Something went wrong</h2>
                    :
                    <>
                        <span 
                            className="absolute flex items-center justify-center top-4 right-4 text-gray-500 duration-200 w-10 h-10 rounded-full cursor-pointer hover:bg-secondary" 
                            onClick={closeModal}
                        >
                            <FaX className="text-xl" />
                        </span>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Select instanceId="ract-select"
                                onChange={(selected: SingleValue<Option<number>>) => {
                                    setValue("violated_rule", selected?.value);
                                }}
                                options={violatedRuleOptions}
                                isSearchable={false}
                                value={violatedRuleOptions.find((option: Option<number>) => option.value === watch("violated_rule"))}
                                isClearable={true}
                                className="mb-2"
                                placeholder={"Violated Rule ( Optional )"}
                            />
                            <textarea 
                                {...register("reason")}
                                className="form-input h-56 resize-none"
                                placeholder="Reason"
                            />
                            <p className={`error ${errors.reason ? "opacity-100" : ""}`}>{errors.reason?.message}</p>
                            <div className="flex items-center justify-between">
                                <p className={`error ${errorMessage ? "opacity-100" : ""}`}>{errorMessage}</p>
                                <Button>
                                    Report
                                </Button>
                            </div>
                        </form>
                    </>
                }
            </div>
        </div>
    );
}