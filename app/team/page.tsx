"use client";

import React, { useEffect } from "react";

function page() {
  return (
    <div className=" flex justify-center p-4">
      <section className=" w-full max-w-[1700px] px-10 mt-20 text-white flex flex-col gap-4 border bottom-2 border-orange-400 py-16 bg-black rounded-3xl">
        <div className="  font-bold text-3xl md:text-5xl transition-all">
          Teams
        </div>
        <div className=" opacity-50">
          Invite team members and collaborate on projects!
        </div>
        <div className=" opacity-80">Coming soon!</div>
      </section>
    </div>
  );
}

export default page;
