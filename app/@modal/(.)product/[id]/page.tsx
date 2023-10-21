"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

interface contextProps {
  params: {
    id: string;
  };
}

function ModalDetailPage(context: contextProps) {
  const router = useRouter();
  const { params } = context;
  const newId = Number(params.id);

  console.log(params.id);
  const { data: product, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const response = await axios.get(`/api/product/${newId}`);
      return response.data;
    },
  });

  console.log(product);
  return (
    <div className=" fixed min-h-screen h-full w-screen flex flex-col items-center justify-center bg-black bg-opacity-70 p-4 gap-3">
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
      <div className=" mb-20 md:mb-0 bg-white w-full max-w-[1400px] h-full max-h-[80%] md:max-h-[60%] rounded-xl  "></div>
    </div>
  );
}

export default ModalDetailPage;
