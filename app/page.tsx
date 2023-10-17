"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    <>
      {isLoadingProducts ? (
        <p>Loading...</p>
      ) : (
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
      )}

      {isLoadingAnimation ? <p>Loading...</p> : <div>Found data</div>}
    </>
  );
}
