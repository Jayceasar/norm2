/* eslint-disable @next/next/no-img-element */
"use client";

import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LucideBadge, LucideBookmark } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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

function Products() {
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const [masonry, setMasonry] = useState<Product[][]>([]);
  const [visible, setVisible] = useState(false);

  // fetch all products on page load
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`/api/products?_=${Date.now()}`);
      return response.data;
    },
  });

  // listen for window size and update the numberOfColumns according to screen size
  useEffect(() => {
    // Function to update windowSize state
    function handleResize() {
      // Define screen size breakpoints
      const smallScreenMaxWidth = 767; // Screens up to 767 pixels wide
      const mediumScreenMinWidth = 768; // Screens starting from 768 pixels wide
      const mediumScreenMaxWidth = 1023; // Screens up to 1023 pixels wide
      const largeScreenMinWidth = 1024; // Screens starting from 1024 pixels wide

      // Get the current window width
      const windowWidth = window.innerWidth;

      // Check the screen size and classify
      if (windowWidth <= smallScreenMaxWidth) {
        // Small screen
        setNumberOfColumns(2);
      } else if (
        windowWidth >= mediumScreenMinWidth &&
        windowWidth <= mediumScreenMaxWidth
      ) {
        // Medium screen
        setNumberOfColumns(3);
      } else if (windowWidth >= largeScreenMinWidth) {
        // Large screen
        setNumberOfColumns(4);
      } else {
        // Some other size
        console.log("Custom screen size");
      }
    }

    // Call handleResize on initial component mount
    handleResize();

    // Attach the event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // re-arrange products

  useEffect(() => {
    // Create an array of arrays to represent the columns
    const columns: Product[][] = Array.from(
      { length: numberOfColumns },
      () => []
    );
    if (products) {
      // Iterate through the products and distribute them to columns
      products?.forEach((product, index) => {
        const columnIndex = index % numberOfColumns; // Determine which column to place the product in
        columns[columnIndex].push(product); // Push the product into the corresponding column
      });
    }

    // Now, the 'columns' array holds the products grouped by columns

    // If you need to set the 'newColumns' state with the arranged products, you can do so here
    setMasonry(columns);
  }, [numberOfColumns, products]);

  const preloaderElements = Array.from({ length: 9 });
  return (
    <div>
      {products ? (
        <section>
          {isLoadingProducts ? (
            <p>Loading...</p>
          ) : (
            <div
              style={{
                gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
              }}
              className=" grid gap-4 md:gap-8"
            >
              {masonry?.map((column, i) => {
                return (
                  <span key={i} className=" flex flex-col gap-6">
                    {column.map((product, i) => {
                      return (
                        <Link
                          href={`/product/${product.id}`}
                          className={` ${
                            visible
                              ? " bg-transparent"
                              : "bg-neutral-800 border-neutral-700 p-4"
                          } min-h-[200px]   text-white h-fit rounded-2xl  w-full transition-all`}
                          key={i}
                        >
                          {product.cover && (
                            <div className=" relative min-h-fit w-full">
                              <img
                                alt="product image"
                                src={product.cover}
                                id="gifImage"
                                className=" relative w-full bg-neutral-800 rounded-lg md:rounded-2xl transition-all"
                                onLoad={() => {
                                  setVisible(true);
                                }}
                              />
                              <div
                                className={` ${
                                  visible
                                    ? " opacity-100 scale-100"
                                    : " opacity-0 scale-0"
                                } scale-75 md:scale-100 absolute bottom-2 right-2 md:bottom-4 md:right-4 hover:-translate-y-1 transition-all`}
                              >
                                <LucideBookmark />
                              </div>
                            </div>
                          )}
                          <span className=" flex flex-col gap-1 py-1 md:py-4">
                            <p className=" text-sm text-neutral-300">
                              {product.title}
                            </p>
                            <p className=" text-xs text-neutral-400">
                              {product.description}
                            </p>
                          </span>
                        </Link>
                      );
                    })}
                  </span>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section
          style={{
            gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
          }}
          className=" grid gap-4"
        >
          {numberOfColumns !== 0 &&
            preloaderElements.map((preloader, i) => {
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

export default Products;
