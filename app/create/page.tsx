"use client";

import { Product } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { db, storage } from "../../firebase/firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

interface FormData {
  title: string;
  description: string;
  tags: string;
  price: number;
  width: number;
  height: number;
  duration: number;
}

function CreateProduct() {
  const router = useRouter();
  // Initialize with an empty string
  const [jsonData, setJsonData] = useState<string>(""); // Initialize with an empty string
  const [cover, setCover] = useState<Blob | undefined>(undefined); // Initialize with an empty string

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    tags: "",
    price: 0,
    width: 0,
    height: 0,
    duration: 0,
  });

  console.log(formData);

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

  async function uploadCoverImage() {
    return new Promise(async (resolve, reject) => {
      if (cover) {
        const coverImageRef = ref(
          storage,
          `products-images/${formData.title + formData.tags}`
        );
        const coverImageUploadTask = uploadBytesResumable(coverImageRef, cover);

        coverImageUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // You can provide progress updates here if needed.
          },
          (error) => {
            console.error("Cover image upload error:", error);
            reject(error); // Reject the promise with an error.
          },
          async () => {
            try {
              const coverImageURL = await getDownloadURL(
                coverImageUploadTask.snapshot.ref
              );
              console.log("Cover image uploaded:", coverImageURL);
              resolve(coverImageURL); // Resolve the promise with the image URL.
            } catch (error) {
              console.error("Error:", error);
              reject(error); // Reject the promise with an error.
            }
          }
        );
      } else {
        reject(new Error("No cover image selected.")); // Reject the promise with an error.
      }
    });
  }

  // create new product
  const { mutate: createProduct, isLoading: isCreatingProduct } = useMutation({
    mutationFn: async () => {
      // upload coverImage to firebase and set link
      const coverImageURL = await uploadCoverImage();

      //then update database
      return axios.post("/api/products/create", {
        ...formData,
        cover: coverImageURL,
        jsonData,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
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
  function handleFileUpload(
    event: ChangeEvent<HTMLInputElement>,
    fileType: string
  ) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;

        if (fileType === "json") {
          // Log "w" and "h" properties before converting
          try {
            const jsonData = JSON.parse(result);
            setFormData((prev) => {
              return {
                ...prev, // Spread the previous state
                width: jsonData.w,
                height: jsonData.h,
                duration: jsonData.op,
              };
            });

            console.log("w:", jsonData.w);
            console.log("h:", jsonData.h);

            // Now, you can convert and set the JSON data
            setJsonData(JSON.stringify(jsonData));
          } catch (error) {
            console.log(error);
          }
        } else if (fileType === "image") {
          // For image files, you can save the URL as the cover
          // setCover(result);
        } else {
          console.log("Invalid file type");
        }
      };

      if (fileType === "json") {
        reader.readAsText(selectedFile);
      } else if (fileType === "image") {
        reader.readAsDataURL(selectedFile);
      } else {
        console.log("Invalid file type");
      }
    } else {
      console.log("No file selected");
    }
  }

  return (
    <div className=" flex gap-4">
      {/* <>
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
      </> */}

      <form
        className=" flex flex-col gap-4 p-4 border-2 border-black rounded-xl"
        onSubmit={(e) => {
          e.preventDefault();
          createProduct();
        }}
      >
        {Object.keys(formData).map((entry, i) => {
          return (
            <input
              key={i}
              required={
                entry !== "width" && entry !== "height" && entry !== "duration"
              }
              className={`${
                entry === "width" || entry === "height" || entry === "duration"
                  ? "hidden"
                  : ""
              }`}
              type={entry === "price" ? "number" : "text"}
              placeholder={entry}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFormData((prev) => {
                  return {
                    ...prev, // Spread the previous state
                    [entry]: e.target.value, // Update the specific property using the key 'entry'
                  };
                });
              }}
            />
          );
        })}

        <input
          required
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            // handleFileUpload(event, "image");
            if (event.target.files && event.target.files.length > 0) {
              setCover(event.target.files[0]);
            }
          }}
        />

        <input
          required
          type="file"
          id="fileInput"
          accept=".json"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            handleFileUpload(event, "json");
          }}
        />

        <button type="submit" className=" p-4 text-white bg-black rounded-xl">
          {isCreatingProduct ? <p>creating...</p> : <p>Create product</p>}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
