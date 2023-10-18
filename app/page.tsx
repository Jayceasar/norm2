"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface product {
  id: number;
  title: string | null;
  description: string | null;
  tags: string | null;
  published: boolean;
  cover: string | null;
  views: number;
  favourited: number;
  price: number | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  previewVideo: string | null;
  randomfield: string | null;
}

export default function Home() {
  const [modal, setModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<product | null>();

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

  // this gets the animation data of the selected product
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
    <div className=" ">
      {/* MODAL SECTION */}
      {modal && (
        <section
          className={` ${
            modal ? "h-full w-screen p-2 md:p-8 md:pb-16 " : " hidden"
          } fixed   bg-black bg-opacity-25 flex flex-col gap-2 items-center justify-center  `}
        >
          <span className=" flex w-full max-w-[1300px] justify-end">
            <button
              onClick={() => {
                setModal(false);
              }}
              className=" flex items-center justify-center w-12 aspect-square bg-white dark:bg-black  rounded-full"
            >
              x
            </button>
          </span>
          <span
            className={`${
              modal ? "w-full max-w-[1300px] h-fit min-h-[70%]" : "w-0 h-0"
            }  flex flex-col md:grid grid-cols-2 gap-2 bg-white  transition-all`}
          >
            {/* video display section */}
            <iframe
              className={`w-full h-full bg-white`}
              src={
                selectedProduct?.previewVideo
                  ? selectedProduct?.previewVideo
                  : ""
              }
            />

            {/* product details section */}
          </span>
        </section>
      )}

      {/* PRODUCTS SECTION */}
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
                    setModal(true);
                    setSelectedProduct(product);
                    // animationData(product.id);
                  }}
                >
                  {product.cover && typeof product.cover === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="product image"
                      src={product.cover}
                      id="gifImage"
                    />
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
    </div>
  );
}
