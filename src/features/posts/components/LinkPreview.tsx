"use client"

import React from "react";
import useSWR from "swr";
import Loading from "@/features/common/components/Loading";
import Button from "@/features/common/components/Button";
import useDebounce from "@/features/common/hooks/useDebounce";
import Link from "next/link";
import Image from "next/image";

type Props = {
    url: string;
}

export default function LinkPreview({ url }: Props) {
    const { debouncedValue } = useDebounce(url, 500);
    const isValid = debouncedValue?.match(/^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:[0-9]{1,5})?(\/.*)?$/);
    const { data: preview, isLoading, error } = useSWR(!isValid ? null : `/api/link-preview?url=${debouncedValue}`);

    if (!isValid || error) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="mt-6 flex items-center justify-center">
                <Loading text="Loading Link Preview..." />
            </div>
        )
    }

    if (isValid && preview) {
        return (
            <Link target="_blank" href={preview?.url || ""} className="mt-6 block border-2 border-secondary overflow-hidden mb-4 rounded-lg">
                <div className="bg-secondary mx-auto">
                    {
                        preview?.image &&
                        <div className="overflow-hidden h-80 relative rounded-md">
                            <Image fill unoptimized className="mx-auto max-w-full" src={preview?.image} alt="Preview image" />
                        </div>
                    }
                </div>
                <div className="flex bg-white items-center justify-between p-3 border-t-2 border-secondary">
                    <h3 className="text-lg text-primary hover:underline font-semibold">{preview?.title || url}</h3>
                    <Button className="mb-0">
                        Open
                    </Button>
                </div>
            </Link>
        )
    }
}