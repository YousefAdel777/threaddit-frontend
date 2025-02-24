import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/features/common/components/Navbar";
import Sidebar from "@/features/common/components/Sidebar";
import Providers from "@/features/common/components/Providers";
import ChatsModal from "@/features/chats/components/ChatsModal";
import MainSection from "@/features/common/components/MainSection";

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
          className={inter.className}
        >
          <Navbar />
          <Sidebar />
          <MainSection>
            {children}
          </MainSection>
          <ChatsModal />
        </body>
      </Providers>
    </html>
  );
}
