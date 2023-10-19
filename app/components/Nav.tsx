import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import UserAccountNav from "./UserAccountNav";

async function Nav() {
  const session = await getServerSession(authOptions);
  // console.log(session);

  return (
    <div className=" w-screen p-4 text-sm flex gap-4 justify-between items-center">
      <Link href="/">norm</Link>
      {session?.user ? (
        <UserAccountNav />
      ) : (
        <Link href={"/sign-in"}>Sign in</Link>
      )}
    </div>
  );
}

export default Nav;
