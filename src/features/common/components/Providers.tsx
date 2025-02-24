"use client"

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import fetcher from "@/lib/fetcher";
import { SWRConfig } from "swr";

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider>
            <SWRConfig value={{ fetcher }}>
                {children}
            </SWRConfig>
        </SessionProvider>
    );
}

export default Providers;