import { z } from "zod";

const textPostSchema = z.object({
    type: z.literal("text"),
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string(),
    community: z.number().optional(),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const mediaPostSchema = z.object({
    type: z.literal("media"),
    title: z.string().min(1, { message: "Title is required" }),
    community: z.number().optional(),
    media: z.instanceof(File).array(),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const linkPostSchema = z.object({
    type: z.literal("link"),
    title: z.string().min(1, { message: "Title is required" }),
    community: z.number().optional(),
    link: z.string().url({ message: "Invalid URL" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const pollPostSchema = z.object({
    type: z.literal("poll"),
    title: z.string().min(1, { message: "Title is required" }),
    community: z.number().optional(),
    options: z.string().array().min(2, { message: "At least 2 options are required" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const postSchema = z.discriminatedUnion("type", [
    textPostSchema,
    linkPostSchema,
    mediaPostSchema,
    pollPostSchema
]);

export default postSchema;