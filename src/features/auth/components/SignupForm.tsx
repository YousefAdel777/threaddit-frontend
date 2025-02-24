"use client"

import { createUser } from "../actions.ts";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTransition } from "react";
import Button from "@/features/common/components/Button";

const signInSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}).email({ message: "Invalid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    username: z.string().min(1, { message: "Username is required" }),
})

type SchemaProps = z.infer<typeof signInSchema>;

export default function SignupForm() {

    const [isPending, startTransition] = useTransition();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SchemaProps>({
        resolver: zodResolver(signInSchema),
    })
    const router = useRouter();

    const onSubmit = (data: SchemaProps) => {
        startTransition(async () => {
            try {
                await createUser(data);
                const res = await signIn('credentials', {
                    email: data.email,
                    password: data.password,
                    redirect: false
                });
                if (res?.ok) {
                    router.refresh();
                    router.push("/");
                }
            }
            catch (error) {
                console.log(error);
            }
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
        <input 
            type="text"
            {...register("username")}
            placeholder="Username"
            className="form-input"
        />
        <p className={`error ${errors.username ? "opacity-100" : ""}`}>
            {errors.username?.message}
        </p>
        <input 
            type="email"
            {...register("email")}
            placeholder="Email"
            className="form-input"
        />
        <p className={`error ${errors.email ? "opacity-100" : ""}`}>
            {errors.email?.message}
        </p>
        <input 
            type="password"
            {...register("password")}
            placeholder="Password"
            className="form-input"
        />
        <p className={`error ${errors.password ? "opacity-100" : ""}`}>
            {errors.password?.message}
        </p>
        <Button disabled={isPending} className="bg-primary mb-4 w-full text-white font-semibold rounded-lg px-3 py-3">
            Sign Up
        </Button>
        <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline font-semibold">
                Sign In
            </Link>
        </p>
    </form>
    )
}