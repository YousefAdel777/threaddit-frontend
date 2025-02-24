/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from "next-auth";

declare module "next-auth" {

    interface User {
        id: number;
        username: string;
        email: string;
        image: string;
        accessToken: string;
        refreshToken: string;
        expires_at: number;
    }

    interface Session  {
        accessToken: string;
        refreshToken: string;
        user: User;
        userId: string;
    }
}