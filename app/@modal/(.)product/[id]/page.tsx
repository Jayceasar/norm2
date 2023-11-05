"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LucideBookmark,
  LucideHeart,
  LucidePause,
  LucidePlay,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface contextProps {
  params: {
    id: string;
  };
}

function ModalDetailPage(context: contextProps) {
  const player = useRef(null);
  const [isplaying, setIsPlaying] = useState(true);
  const router = useRouter();
  const { params } = context;
  const newId = Number(params.id);

  const { data: session } = useSession();

  //fetch product
  const { data: product, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["product", params.id],
    queryFn: async () => {
      const response = await axios.get(`/api/product/${newId}`);
      return response.data;
    },
  });

  // create new project
  const { mutate: createProject, isLoading: isCreatingProduct } = useMutation({
    mutationFn: async () => {
      //then update database
      return axios.post("/api/projects/create", {
        owner: session?.user.email,
        template: product?.id,
        cover: product?.cover,
        title: "untitled",
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log("Server Response:", data);

      // Create a hidden <a> button
      const link = document.createElement("a");
      link.href = `/dashboard/projects/edit/${data.data.product.id}`;
      link.textContent = "Go to New Page"; // Button text
      link.style.display = "none"; // Hide the button

      // Append the link to the document body
      document.body.appendChild(link);

      // Programmatically click the hidden button
      link.click();
    },
  });

  return (
    <div className=" z-[800000] text-black fixed min-h-screen h-full w-screen flex flex-col items-center justify-center bg-black bg-opacity-70 p-4 gap-3">
      <div className=" w-full max-w-[1400px] flex justify-end">
        <Button
          className=" rounded-full"
          onClick={() => {
            router.back();
          }}
        >
          x
        </Button>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-2 mb-20 md:mb-0 bg-white w-full max-w-[1400px] h-full max-h-[80%] md:max-h-[60%] rounded-xl overflow-hidden transition-all ">
        {/* <div className=" flex w-full h-full justify-center items-center">
          <ReactPlayer
            loop
            playing={isplaying}
            ref={player}
            id="preview"
            url={product?.previewVideo}
            width="100%"
            height="100%"
          ></ReactPlayer>
        </div> */}
        <iframe
          src={product?.previewVideo}
          className=" w-full h-full bg-black"
        />

        <span className=" p-4 flex flex-col gap-3 justify-between">
          <span className=" details">
            <p>{product?.title}</p>
            <p>{product?.description}</p>
            <p>{product?.tags}</p>
          </span>
          <span className=" action-buttons flex flex-col gap-2">
            <div className=" flex gap-2 text-xs text-neutral-400">
              <p>{product?.favourited} people love this</p>
            </div>
            <div className=" flex gap-2 items-center">
              {/* <div
                className={` ${
                  isplaying ? " bg-neutral-300" : "bg-orange-500 text-white"
                } flex  p-2 rounded-full transition-all`}
                onClick={() => {
                  setIsPlaying(!isplaying);
                }}
              >
                {!isplaying ? (
                  <div className=" translate-x-[2px]">
                    <LucidePlay />
                  </div>
                ) : (
                  <LucidePause />
                )}
              </div> */}
              <LucideHeart />
              <LucideBookmark />
            </div>
            {product?.id !== null && (
              <Button
                onClick={() => {
                  createProject();
                }}
                className=" w-full bg-black text-white hover:bg-orange-500  py-4"
              >
                Edit template
              </Button>
            )}
          </span>
        </span>
      </div>
    </div>
  );
}

export default ModalDetailPage;
