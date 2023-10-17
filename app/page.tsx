"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [dataProducts, setDataProducts] = useState<Product[] | null>(null);
  // fetch all products on page load
  // const { data: dataProducts, isLoading: isLoadingProducts } = useQuery<
  //   Product[]
  // >({
  //   queryKey: ["products"],
  //   queryFn: async () => {
  //     const response = await axios.get("/api/products");
  //     return response.data;
  //   },
  // });

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

  useEffect(() => {
    async function fetchProducts() {
      const response = await axios.get("/api/products");
      setDataProducts(response.data);
      console.log(response.data);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <div>
        {dataProducts?.map((product, i) => {
          return (
            <button
              className=" p-4 border-2 border-black w-fit"
              key={i}
              onClick={() => {
                animationData(product.id);
              }}
            >
              <p>{product.title}</p>
            </button>
          );
        })}
      </div>

      {isLoadingAnimation ? <p>Loading...</p> : <div>Found data</div>}
    </>
  );
}
