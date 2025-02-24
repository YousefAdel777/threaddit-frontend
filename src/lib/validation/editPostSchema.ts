import { z } from "zod";

const textPostSchema = z.object({
    type: z.literal("text"),
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string(),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const mediaPostSchema = z.object({
    type: z.literal("media"),
    title: z.string().min(1, { message: "Title is required" }),
    media: z.instanceof(File).array().min(1, { message: "At least 1 attachment is required" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const linkPostSchema = z.object({
    type: z.literal("link"),
    title: z.string().min(1, { message: "Title is required" }),
    link: z.string().url({ message: "Invalid URL" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const pollPostSchema = z.object({
    type: z.literal("poll"),
    title: z.string().min(1, { message: "Title is required" }),
    options: z.string().array().min(2, { message: "At least 2 options are required" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const crossPostSchema = z.object({
    type: z.literal("crosspost"),
    title: z.string().min(1, { message: "Title is required" }),
    is_spoiler: z.boolean(),
    is_nsfw: z.boolean(),
});

const editPostSchema = z.discriminatedUnion("type", [
    textPostSchema,
    linkPostSchema,
    mediaPostSchema,
    pollPostSchema,
    crossPostSchema
]);

export default editPostSchema;