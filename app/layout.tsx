import "./styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import Nav from "./components/Nav";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Norm",
  description: "Boost sales with video",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" className=" ">
      <body className={inter.className}>
        <Providers>
          <SessionProvider session={session}>
            {modal}
            <div className=" w-screen ">
              <Nav />
            </div>
            <div className=" w-screen min-h-screen text-black dark:text-white">
              {children}
            </div>
          </SessionProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
