import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import Nav from "./components/Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Norm",
  description: "Boost sales with video",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionProvider session={session}>
            <div className=" w-screen">
              <Nav />
            </div>
            <div className=" w-screen h-full text-black dark:text-white">
              {children}
            </div>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
