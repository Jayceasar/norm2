"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";

function Bucket() {
  const [user, setUser] = useState();
  const [userDoc, setUserDoc] = useState();
  const router = useRouter();
  console.log(userDoc);

  return (
    <div className=" px-10 pt-20 flex flex-col gap-4">
      <div className=" text-white flex flex-col gap-4 border bottom-2 border-blue-400 p-6 py-16 bg-black rounded-3xl">
        <div className=" font-bold text-3xl md:text-5xl transition-all">
          Bucket
        </div>
        <div className=" opacity-50">
          Organize all your frequently used assets here!
        </div>
        <div className=" opacity-80">Coming soon!</div>
      </div>

      <p className=" mt-40 text-white">Recent downloads</p>
      <section className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* {userDoc?.downloads?.map((download, i) => {
          return (
            <span
              key={i}
              className=" p-4  bg-neutral-900 rounded-2xl flex items-center justify-between gap-4 h-24 text-white"
            >
              <div className=" h-full aspect-square rounded-xl bg-black flex items-center justify-center">
                {i + 1}
              </div>
              <a
                href={download}
                target="_black"
                className=" p-4 bg-neutral-950 h-fit text-xs px-6 hover:bg-orange-400 hover:text-black rounded-2xl transition-all "
              >
                Preview
              </a>
            </span>
          );
        })} */}
      </section>
    </div>
  );
}

export default Bucket;
