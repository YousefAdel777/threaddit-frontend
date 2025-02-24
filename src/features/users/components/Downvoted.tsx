"use client"
import Select, { SingleValue } from "react-select";
import { useState } from "react";
import DownvotedPosts from "@/features/posts/components/DownvotedPosts";
import DownvotedComments from "@/features/comments/components/DownvotedComments";

const filterOptions = [
    {
        value: "posts",
        label: "Posts",
    },
    {
        value: "comments",
        label: "Comments",
    }
]

export default function Downvoted() {
    const [filter, setFilter] = useState("posts");

    return (
        <section>
            <Select 
                instanceId="ract-select"
                onChange={(val: SingleValue<Option<string>>) => {
                    if (val) {
                        setFilter(val.value);
                    }
                }}
                value={filterOptions.find((option) => option.value === filter)}
                options={filterOptions}
                isSearchable={false}
                className="w-52 mb-4"
            />
            <div>
                {
                    filter === 'posts' ?
                    <DownvotedPosts />
                    :
                    <DownvotedComments />
                }
            </div>
        </section>
    )
}