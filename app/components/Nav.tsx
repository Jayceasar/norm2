import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import UserAccountNav from "./UserAccountNav";
import logo from "../norm.svg";
import Image from "next/image";

async function Nav() {
  const session = await getServerSession(authOptions);
  const dashboardLinks = [
    { name: "Dashboard", link: `/dashboard` },
    { name: "Projects", link: `/projects` },
    { name: "Bucket", link: `/bucket` },
    { name: "Teams", link: `/team` },
  ];

  return (
    <div className=" absolute top-0 z-[4000000] w-screen px-8 py-5 text-sm flex justify-between gap-4 items-center bg-neutral-900">
      <div className=" flex gap-10">
        <Link
          className=" w-20 text-2xl md:text-3xl font-bold text-white  h-full flex justify-center items-center "
          href="/"
        >
          <Image alt="norm logo" src={logo} />
        </Link>

        <div className=" hidden md:flex gap-16 h-full items-center ">
          {dashboardLinks.map((nav, i) => {
            return (
              <Link key={i} href={nav.link} className=" text-sm text-end">
                <button>{nav.name}</button>
              </Link>
            );
          })}
        </div>
      </div>

      {session?.user ? (
        <UserAccountNav />
      ) : (
        <Link href={"/sign-in"}>Sign in</Link>
      )}
    </div>
  );
}

export default Nav;
