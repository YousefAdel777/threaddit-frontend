"use client"

import Select, { SingleValue } from "react-select";
import { useState } from "react";
import UpvotedComments from "@/features/comments/components/UpvotedComments";
import UpvotedPosts from "@/features/posts/components/UpvotedPosts";

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

export default function Upvoted() {
    const [filter, setFilter] = useState("posts");

    return (
        <section>
            <Select instanceId="ract-select"
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
                    filter === "posts" ?
                    <UpvotedPosts />
                    :
                    <UpvotedComments />
                }
            </div>
        </section>
    )
}