import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import Providers from "@/features/common/components/Providers";
import Navbar from "@/features/common/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threaddit",
  description: "Threaddit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${inter.className} p-0`}
        >
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}
