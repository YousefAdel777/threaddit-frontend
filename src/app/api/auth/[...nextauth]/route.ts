import NextAuth from "next-auth";
import { options } from "./options";

export const { handlers: { GET, POST }, auth, signIn, signOut, unstable_update: update } = NextAuth(options);