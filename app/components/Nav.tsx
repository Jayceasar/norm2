import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import UserAccountNav from "./UserAccountNav";
import logo from "../norm.svg";
import logoIcon from "../normIcon.svg";
import Image from "next/image";

async function Nav() {
  const session = await getServerSession(authOptions);
  const dashboardLinks = [
    { name: "Projects", link: `/projects` },
    { name: "Bucket", link: `/bucket` },
    { name: "Teams", link: `/team` },
  ];

  return (
    <div className=" flex">
      <section
        style={{ backdropFilter: `blur(50px)` }}
        className=" fixed top-0 z-[4000000] w-screen px-4 md:px-8 py-3 text-sm flex justify-between gap-4 items-center bg-neutral-700 bg-opacity-10"
      >
        <div className=" flex gap-10">
          <Link
            className=" w-20 text-2xl md:text-3xl font-bold   h-full flex justify-start items-center transition-all "
            href="/"
          >
            <Image className=" hidden md:flex" alt="norm logo" src={logo} />
            <Image
              className=" text-white  w-10 md:hidden flex"
              alt="norm icon"
              src={logoIcon}
            />
          </Link>

          <div className=" hidden md:flex gap-16 h-full items-center justify-center ">
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
          <Link href={"/sign-in"}>Get started</Link>
        )}
      </section>
      <section></section>
    </div>
  );
}

export default Nav;
