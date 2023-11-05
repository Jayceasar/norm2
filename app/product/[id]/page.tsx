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

interface contextProps {
  params: {
    id: string;
  };
}

function ProductDetailPage(context: contextProps) {
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
    <section className=" w-full flex items-center justify-center mt-10 p-4  h-[97vh] ">
      <div className=" w-full max-w-[1600px] h-full max-h-[90vh] md:max-h-[800px] grid grid-cols-1 md:grid-cols-2 rounded-lg overflow-clip ">
        <iframe
          src={product?.previewVideo}
          className=" w-full h-full bg-black"
        />
        <div className=" w-full h-fit md:h-full flex flex-col justify-between bg-neutral-800 p-4">
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
                className=" w-fit  py-4"
              >
                Edit template
              </Button>
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;
