import type { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import api, { BASE_URL } from "@/lib/apiAxios";
import axios from "axios";

export const options: NextAuthConfig = {
    providers: [
        CredentialProvider({
            id: "oauth",
            credentials: {
                accessToken: {
                    type: "text",
                },
                refreshToken: {
                    type: "text",
                }
            },
            async authorize(credentials) {
                console.log(credentials);
                const res = await axios.get(`${BASE_URL}/auth/user`, {
                    headers: {
                        Authorization: `Bearer ${credentials?.accessToken}`,
                    },
                });
                console.log(res.data)
                const { id, email, username, image } = res.data;
                return {
                    id,
                    accessToken: credentials.accessToken,
                    refreshToken: credentials.refreshToken,
                    email,
                    username,
                    image,
                    expires_at: Math.floor((Date.now() + (30 * 60 * 1000)) / 1000),
                }
            }
        }),
        CredentialProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    type: "email",
                    label: "Email: ",
                    placeholder: "email",
                },
                password: {
                    type: "password",
                    label: "Password: ",
                    placeholder: "password",
                },
            },
            async authorize(credentials) {
                try {
                    const res = await api.post("/auth/login/", {
                        email: credentials?.email,
                        password: credentials?.password
                    });
                    const { access, refresh, user } = res.data;
                    const { email, username, image, id } = user;
                    return {
                        id,
                        accessToken: access,
                        refreshToken: refresh,
                        email,
                        username,
                        image,
                        expires_at: Math.floor((Date.now() + (30 * 60 * 1000)) / 1000),
                    }
                }
                catch (error: any) {
                    if (error.response.status === 401) {
                        throw new Error(JSON.stringify(error.response.data));
                    }
                    // throw new Error("Wrong Email or Password");
                    console.log(error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async jwt({token, user, account, trigger, session}) {
            // if (account) {
            //     token.accessToken = account.access_token;
            //     token.refreshToken = account.refresh_token;
            //     token.expires_at = account.expires_at;
            // }
            // if (trigger === "update") {
            //     token.accessToken = session.accessToken as string;
            // }
            
            if (user) {                
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.expires_at = user.expires_at;
                token.userId = user.id;
                token.image = user.image;
                token.username = user.username;
                token.email = user.email;
            }
            
            if (token.expires_at as number * 1000 > Date.now()) {
                return token;
            }
            
            // if (trigger === "update") {
            //     console.log(session);
            //     console.log(token)
            //     return {
            //         ...token,
            //         ...session.user,
            //         expires_at: Math.floor((Date.now() + (30 * 60 * 1000)) / 1000),
            //         accessToken: session.accessToken,
            //         refreshToken: session.refreshToken
            //     }
            //     // token.accessToken = session.accessToken;
            // }

            try {
                const res = await axios.post("/auth/token/refresh/", {
                    refresh: token.refreshToken
                });
                token.accessToken = res.data.access;
                token.expires_at = Math.floor((Date.now() + (30 * 60 * 1000)) / 1000);
            }
            catch (error) {
                console.log(error.response.data);
                return null;
            }

            return token;
            // return { ...token, ...user };
        },

        async session({session, token}) {
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            session.userId = token.userId as string;
            session.user = {
                id: token.userId as string,
                image: token.image as string,
                username: token.username as string,
                email: token.email as string,
                accessToken: token.accessToken as string,
                refreshToken: token.refreshToken as string,
                expires_at: token.expires_at as number,
                emailVerified: null,
            };
            return session;
        },
        async signIn({ account, profile, email, credentials }) {
            if (account?.provider === "github") {
                
            }
            return true;
            // if (account?.provider === "github") {
            //     const res = await api.post("/api/auth/social/github", {
            //         access_token: account.access_token,
            //     });                
            //     if (res.status === 200) {
            //         return true;
            //     }
            //     else {
            //         return false;
            //     }
            // }
            // else if (account?.provider === "google") {
            //     const res = await api.post("/api/auth/social/google", {
            //         access_token: account.access_token,
            //     });
            //     if (res.status === 200) {
            //         return true;
            //     }
            //     else {
            //         return false;
            //     }
            // }
            // return true;
        },
        async authorized({ auth }) {
            return !!auth;
        }
    }
}