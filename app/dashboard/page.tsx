import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UserAccountNav from "../components/UserAccountNav";
import puzzle from "@/app/json/images/puzzle.png";
import Image from "next/image";

async function Projects() {
  const preloaderElements = Array.from({ length: 8 });
  const session = await getServerSession(authOptions);

  return (
    <div className=" p-4 pt-24 flex flex-col items-center gap-8">
      <section className=" md:pr-20 max-w-[1700px] border border-neutral-800 flex flex-col justify-between md:flex-row gap-2  md:items-center p-6 banner w-full h-[400px] bg-neutral-900 rounded-2xl transition-all">
        <span>
          <h1>Grow with video</h1>
          <h3 className=" text-neutral-400">
            Let’s help you build a great workflow
          </h3>
        </span>
        <span className=" w-48 aspect-square">
          <Image alt="dashboard" src={puzzle} />
        </span>
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Projects</p>
          <h6>Here is a list of your recent projects</h6>
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

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Downloads</p>
          <h6>Here is a list of your recent downloads</h6>
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

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Team</p>
          <h6>Add and edit team member privileges</h6>
        </span>
        <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <UserAccountNav />
          </div>
        </span>
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Settings</p>
          <h6>Modify and click save to make changes</h6>
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

export default Projects;
