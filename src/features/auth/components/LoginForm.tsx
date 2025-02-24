"use client"

import { signIn } from "next-auth/react";
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import  { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const signInSchema = z.object({
    email: z.string().min(1, {"message": "Email is required"}).email({ message: "Invalid email" }),
    password: z.string().min(1, { message: "Password is required" }),
})

type SchemaProps = Zod.infer<typeof signInSchema>;

export default function LoginForm() {

    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<SchemaProps>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = ({ email, password }: SchemaProps) => {
        setErrorMessage("");
        startTransition(async () => {
            try {
                const res = await signIn("credentials", {
                    email,
                    password,
                    redirect: false
                });
                console.log(res);
                
                if (res?.error) {
                    setErrorMessage(res.error);
                }
                else {
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
        >
            <input 
                type="email"
                {...register("email")}
                placeholder="Email"
                className="w-full mb-2 rounded-lg py-3 px-4 bg-ternary outline-none"
            />
            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.email && "opacity-100"}`}>
                {errors.email?.message}
            </p>
            <input 
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-full mb-2 rounded-lg py-3 px-4 bg-ternary outline-none"
            />
            <p className={`text-red-500 mb-2 text-xs italic font-bold opacity-0 duration-150 ${errors.password && "opacity-100"}`}>
                {errors.password?.message}
            </p>
            <button disabled={isPending} className={`bg-primary mb-4 w-full text-white font-semibold rounded-lg px-3 py-3 ${isPending ? "opacity-50" : "hover:bg-primary-hover"} duration-100`}>
                Sign In
            </button>
            {
                errorMessage && <p className="text-red-500 mb-2 text-center text-sm font-bold">{errorMessage}</p>
            }
            <p className="text-center text-sm">
                New to Threaddit? <Link href="/signup" className="text-primary hover:underline font-semibold">Sign Up</Link>
            </p>
        </form>
    )
}