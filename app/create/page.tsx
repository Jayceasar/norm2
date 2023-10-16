"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

function CreateProduct() {
  const router = useRouter();
  const [title, setTitle] = useState<string>(""); // Initialize with an empty string
  const [jsonData, setJsonData] = useState<string>(""); // Initialize with an empty string

  console.log(title);

  //get all products
  const { data: dataProducts, isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
  });

  // create new product
  const { mutate: createProduct, isLoading } = useMutation({
    mutationFn: async () => {
      return axios.post("/api/products/create", {
        title,
        jsonData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      // router.push("/");
      router.refresh();
    },
  });

  // delete a product
  const { mutate: deleteProduct, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`/api/products/${id}`);
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      //   router.push("/");
    },
  });

  // read file data
  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const fileInput = event.target as HTMLInputElement;
    const jsonDataDisplay = document.getElementById(
      "jsonData"
    ) as HTMLPreElement;

    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];

      if (selectedFile.type === "application/json") {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);

            // jsonDataDisplay.textContent = JSON.stringify(jsonData, null, 2);
            setJsonData(JSON.stringify(jsonData, null, 2));
          } catch (error) {
            console.log(error);
          }
        };

        reader.readAsText(selectedFile);
      } else {
        jsonDataDisplay.textContent = "Please select a .json file.";
      }
    } else {
      jsonDataDisplay.textContent = "No file selected.";
    }
  }

  return (
    <div className=" flex gap-4">
      <button
        onClick={() => {
          createProduct();
        }}
      >
        Create product
      </button>

      <>
        {isLoadingProducts ? (
          <p>Loading...</p>
        ) : (
          <div>
            {dataProducts?.map((product, i) => {
              return (
                <div className=" flex gap-2" key={i}>
                  <p>{product.title}</p>
                  <button
                    onClick={() => {
                      deleteProduct(product.id);
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </>

      <input
        className=" text-neutral-700"
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitle(e.target.value);
        }}
      />

      <input
        type="file"
        id="fileInput"
        accept=".json"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          handleFileUpload(event);
        }}
      />
      {/* <pre id="jsonData">{jsonData}</pre> */}
    </div>
  );
}

export default CreateProduct;
