"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const UserAccountNav = () => {
  return (
    <Button className=" text-xs" onClick={() => signOut()}>
      Sign out
    </Button>
  );
};

export default UserAccountNav;
