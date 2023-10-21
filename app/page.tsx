"use client";

import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

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
  const { data: dataProducts, isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`/api/products?_=${Date.now()}`);
      return response.data;
    },
  });

  return (
    <div className=" ">
      {/* PRODUCTS SECTION */}
      <section>
        {isLoadingProducts ? (
          <p>Loading...</p>
        ) : (
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataProducts?.map((product, i) => {
              return (
                <Link
                  href={`/product/${product.id}`}
                  className=" p-4 border-2 border-black w-fit"
                  key={i}
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
