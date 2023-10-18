"use client";

// import { signIn, signOut, useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { signIn, signOut, useSession } from "next-auth/react";

function Nav() {
  const { data: session } = useSession();
  // const session = await getServerSession(authOptions);
  // console.log(session);

  function AuthButton() {
    if (session) {
      return (
        <button
          className=" text-black dark:text-white"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      );
    }
    return (
      <button className=" text-black dark:text-white" onClick={() => signIn()}>
        signIn
      </button>
    );
  }
  return (
    <div className=" w-screen flex h-12 bg-neutral-200 dark:bg-neutral-800  ">
      <div className="  justify-self-end flex gap-2 p-1 ">
        <div
          className=" h-full aspect-square rounded-full"
          style={{
            backgroundImage: `url(${session?.user?.image})`,
            backgroundSize: "cover",
          }}
        ></div>
        <AuthButton />
      </div>
    </div>
  );
}

export default Nav;
