"use client";

import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Banner from "./components/Banner";

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
  // fetch all products on page load
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`/api/products?_=${Date.now()}`);
      return response.data;
    },
  });

  const preloaderElements = Array.from({ length: 9 });

  return (
    <div style={{ marginTop: "100px" }} className=" px-2 md:px-10 ">
      <Banner />
      {products ? (
        <section>
          {isLoadingProducts ? (
            <p>Loading...</p>
          ) : (
            <div className=" grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
              {products?.map((product, i) => {
                return (
                  <Link
                    href={`/product/${product.id}`}
                    className=" h-fit rounded-xl  w-fit"
                    key={i}
                  >
                    {product.cover && typeof product.cover === "string" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt="product image"
                        src={product.cover}
                        id="gifImage"
                        className=" rounded-2xl"
                      />
                    ) : (
                      <p>No product image available</p>
                    )}
                    <p>{product.title}</p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section className=" grid grid-cols-2 md:grid-cols-5 gap-4">
          {preloaderElements.map((preloader, i) => {
            return (
              <div
                key={i}
                className=" border border-neutral-700 w-full h-[400px] md:h-[700px] bg-neutral-800 rounded-2xl animate-pulse"
              ></div>
            );
          })}
        </section>
      )}
    </div>
  );
}
