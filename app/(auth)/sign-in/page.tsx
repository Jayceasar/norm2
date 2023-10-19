"use client";

import SignInForm from "@/app/components/SignInForm";
import React from "react";

function page() {
  return (
    <div className=" w-[400px] border border-black dark:border-white  p-6 rounded-xl">
      <SignInForm />
    </div>
  );
}

export default page;
