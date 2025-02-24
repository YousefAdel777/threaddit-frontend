"use client"

import { FormEvent, useState } from "react";
import useDebounce from "@/features/common/hooks/useDebounce";
import { useRouter } from "next/navigation";
import SearchResults from "@/features/search/components/SearchResults";

export default function Search() {
    const [search, setSearch] = useState("");
    const [showResults, setShowResults] = useState(false);
    const { debouncedValue } = useDebounce(search, 500);
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search) {
            router.push(`/search?q=${search}`);
        }
    }

    return (
        <div className="relative">
            {
                showResults && debouncedValue &&
                <div className="absolute z-50 left-0 -bottom-4 translate-y-full w-full">
                    <SearchResults query={debouncedValue} />
                </div>
            }
            <form className="realative w-full" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Threaddit"
                    onFocus={() => setShowResults(true)}
                    onBlur={() => setShowResults(false)}
                    className=" text-sm focus:z-40 bg-gray-100 rounded-3xl focus:shadow-md outline-none hover:bg-gray-200 duration-100 py-3 pl-6 pr-3 placeholder:text-gray-600 lg:w-[30rem] block"
                />
            </form>
        </div>
    );
}