"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideUpload } from "lucide-react";

function Bucket() {
  const preloaderElements = Array.from({ length: 8 });

  return (
    <div className=" px-4 md:px-10 pt-20 flex flex-col items-center gap-4">
      <section className=" w-full max-w-[1700px] text-white flex flex-col gap-4  bottom-2p-6 py-16 rounded-3xl">
        <div className=" font-bold text-3xl md:text-5xl transition-all">
          Bucket
        </div>
        <div className=" opacity-50">
          Organize all your frequently used assets here!
        </div>
        <div className=" opacity-80"></div>
      </section>

      <section className=" w-full max-w-[1700px] text-white p-4 flex items-center gap-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <p>Assets: 8</p>
        <input id="add-to-bucket" type="file" className=" hidden" />
        <label
          htmlFor="add-to-bucket"
          className=" flex gap-4 items-center bg-orange-500 p-2 px-4 rounded-full hover:px-6 transition-all"
        >
          <p>Upload</p>
          <p className=" scale-75">
            <LucideUpload />
          </p>
        </label>
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Files</p>
          <h6>Here is a list everything you have uploaded</h6>
        </span>
        <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          {preloaderElements.map((item, i) => {
            return (
              <Link
                className=" min-h-[200px] bg-neutral-900 rounded-2xl border border-neutral-800 animate-pulse "
                href={`/dashboard/projects/edit/26`}
                key={i}
              ></Link>
            );
          })}
        </span>
      </section>
    </div>
  );
}

export default Bucket;
