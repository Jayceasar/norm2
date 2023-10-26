"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserAccountNav = () => {
  const { data: session } = useSession();

  return <Link href="/dashboard">{session?.user?.name}</Link>;
};

export default UserAccountNav;
