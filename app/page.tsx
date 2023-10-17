"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect } from "react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Home() {
  // fetch all products on page load
  const { data: dataProducts, isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`/api/products?_=${Date.now()}`);
      return response.data;
    },
  });

  console.log(dataProducts);

  // load animation
  const { mutate: animationData, isLoading: isLoadingAnimation } = useMutation({
    mutationFn: async (id: number) => {
      return axios.get(`/api/animation/${id}`);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <section>
      {isLoadingProducts ? (
        <p>Loading...</p>
      ) : (
        <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
          {dataProducts?.map((product, i) => {
            return (
              <div
                className=" p-4 border-2 border-black w-fit"
                key={i}
                onClick={() => {
                  animationData(product.id);
                }}
              >
                {product.cover && typeof product.cover === "string" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt="product image" src={product.cover} id="gifImage" />
                ) : (
                  <p>No product image available</p>
                )}
                <p>{product.title}</p>
              </div>
            );
          })}
        </div>
      )}

      {isLoadingAnimation ? <p>Loading...</p> : <div>Found data</div>}
    </section>
  );
}
