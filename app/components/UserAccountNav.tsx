"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Session {
  user: {
    name?: string;
    username: string;
    // Add other properties as needed
  };
  // Add other properties as needed
}

const UserAccountNav = () => {
  const { data: session } = useSession();
  const [displayLetter, setDisplayLetter] = useState<string>("");
  // const  = session?.user?.name[0];

  useEffect(() => {
    if (session?.user?.name !== "" || session?.user?.username !== "") {
      if (session && session.user && session.user.name) {
        const firstLetter = session.user.name[0];
        setDisplayLetter(firstLetter);
      } else if (session && session.user && session.user.email) {
        const firstLetter = session.user.email[0];
        setDisplayLetter(firstLetter);
      }
    }
  }, [session]);

  return (
    <div className=" relative flex gap-2">
      <Link
        href={"/pricing"}
        className=" hidden md:flex items-center justify-center text-[10px] md:text-xs  py-0 md:py-1 px-6 border border-neutral-500 hover:bg-[#ff7d26] hover:px-9 text-white rounded-full transition-all"
      >
        Go pro
      </Link>
      <Link href="/dashboard">
        {session?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <div className=" w-8 md:w-10 aspect-square rounded-full border border-neutral-500 overflow-hidden transition-all">
            <div
              className="w-full h-full "
              style={{
                backgroundImage: `url(${session?.user?.image})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        ) : (
          <div>{displayLetter}</div>
        )}
      </Link>
    </div>
  );
};

export default UserAccountNav;
