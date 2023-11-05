"use client";

import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UserAccountNav from "../components/UserAccountNav";
import puzzle from "@/app/json/images/puzzle.png";
import Image from "next/image";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import { LucideTrash } from "lucide-react";
import { useRouter } from "next/navigation";

function Projects() {
  const router = useRouter();
  const preloaderElements = Array.from({ length: 8 });
  const { data: session } = useSession();

  // fetch all projects for a particular user on page load
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: [`UserProjects`, session?.user?.email],
    queryFn: async ({ queryKey }) => {
      const [, userEmail] = queryKey;
      const response = await axios.get(`/api/projects/user`, {
        params: {
          email: userEmail,
          _t: Date.now(), // Adding a timestamp to the request, if needed
        },
      });
      return response.data;
    },
  });
  console.log(projects);

  // delete a project
  const { mutate: deleteProject, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/api/projects/${id}`);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {},
  });

  return (
    <div className=" p-4 pt-24 flex flex-col items-center gap-8 text-black dark:text-white">
      <section className=" md:pr-20 max-w-[1700px] border border-neutral-300 dark:border-neutral-800 flex flex-col justify-between md:flex-row gap-2  md:items-center p-6 banner w-full h-[400px] bg-neutral-100 dark:bg-neutral-900 rounded-2xl transition-all">
        <span className=" ">
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
        <span className=" flex items-center  gap-4 py-4 text-black dark:text-white ">
          <p className=" font-bold">Projects</p>
          <h6>Here is a list of your recent projects</h6>
        </span>
        {projects && projects?.length === 0 ? (
          <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
            {preloaderElements.map((item, i) => {
              return (
                <div
                  className=" min-h-[200px] bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-800 animate-pulse "
                  key={i}
                ></div>
              );
            })}
          </span>
        ) : (
          <span className=" grid grid-cols-2 md:grid-cols-4 gap-4 h-fit max-h-[40vh] overflow-scroll">
            {projects
              ?.slice()
              .reverse()
              .map((item, i) => {
                return (
                  <div key={i} className=" w-full h-fit flex flex-col gap-2 ">
                    <Link
                      style={{
                        backgroundImage: `url(${item.cover})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      className=" min-h-[200px]  rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-900 "
                      href={`/dashboard/projects/edit/${item.id}`}
                    ></Link>
                    <span className=" w-full flex justify-between text-black dark:text-white">
                      <p className=" text-black dark:text-neutral-300 text-sm">
                        {item?.title}
                      </p>
                      <LucideTrash
                        onClick={() => {
                          deleteProject(item.id);
                        }}
                        className=" scale-75 hover:text-red-600 transition-all drop-shadow-2xl"
                      />
                    </span>
                  </div>
                );
              })}
          </span>
        )}
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex items-center  gap-4 py-4 text-black dark:text-white">
          <p className=" font-bold">Downloads</p>
          <h6>Here is a list of your recent downloads</h6>
        </span>
        <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          {preloaderElements.map((item, i) => {
            return (
              <div
                className=" min-h-[200px] bg-neutral-200 dark:bg-neutral-900 rounded-2xl border border-neutral-300 dark:border-neutral-800 animate-pulse "
                key={i}
              ></div>
            );
          })}
        </span>
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex items-center  gap-4 py-4 text-black dark:text-white">
          <p className=" font-bold">Team</p>
          <h6>Add and edit team member privileges</h6>
        </span>
        <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <UserAccountNav />
          </div>
        </span>
      </section>

      <section className=" text-white max-w-[1700px] flex flex-col justify-end gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex items-center gap-4 py-4 text-black dark:text-white">
          <p className=" font-bold">Settings</p>
          <h6 className="">Modify and click save to make changes</h6>
        </span>
        <span className=" grid grid-cols-2 md:grid-cols-4 gap-4"></span>
      </section>
    </div>
  );
}

export default Projects;
