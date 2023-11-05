/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LucideTrash, LucideTrash2, LucideUpload } from "lucide-react";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSession } from "next-auth/react";

function Bucket() {
  const preloaderElements = Array.from({ length: 8 });
  const [bucketItems, setBucketItems] = useState<string[]>([]);
  const { data: session } = useSession();

  console.log(bucketItems);

  useEffect(() => {
    if (!session) {
      return; // Exit early if there's no session data
    }

    const listRef = ref(storage, `user-bucket/${session.user.email}`);

    // Use async/await to simplify the code and make it more readable
    const fetchDownloadURLs = async () => {
      try {
        const res = await listAll(listRef);

        // Use Promise.all to parallelize the fetching of download URLs
        const downloadURLPromises = res.items.map(async (itemRef) => {
          try {
            return getDownloadURL(itemRef);
          } catch (error) {
            console.error(
              "Error getting download URL for",
              itemRef.name,
              ":",
              error
            );
            return null; // Return null for failed fetches
          }
        });

        const downloadURLs = await Promise.all(downloadURLPromises);

        // Filter out null values (failed fetches) and duplicates
        const uniqueDownloadURLs = Array.from(
          new Set(downloadURLs.filter((url) => url !== null) as string[])
        ); // Type assertion to string[]

        setBucketItems(uniqueDownloadURLs);
      } catch (error) {
        console.error("Uh-oh, an error occurred while listing files:", error);
      }
    };

    fetchDownloadURLs();
  }, [session]);

  //upload files to Firebase
  async function uploadToFireBase(file: Blob) {
    if (file) {
      console.log("upload");

      const uniqueFilename = `${Date.now()}-${session?.user.email}-unique-name`;

      const storageRef = ref(
        storage,
        `user-bucket/${session?.user.email}/${uniqueFilename}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }

  return (
    <div className=" text-black dark:text-white px-4 md:px-10 pt-20 flex flex-col items-center gap-4 min-h-screen">
      <section className=" w-full max-w-[1700px] flex flex-col gap-4  bottom-2p-6 py-16 rounded-3xl">
        <div className=" font-bold text-3xl md:text-5xl transition-all">
          Bucket
        </div>
        <div className=" opacity-50">
          Organize all your frequently used assets here!
        </div>
        <div className=" opacity-80"></div>
      </section>

      <section className=" w-full max-w-[1700px] text-white p-4 flex items-center gap-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <p>Assets: 8</p>
        <input
          id="add-to-bucket"
          type="file"
          className=" hidden"
          accept="image/*,audio/*"
          onChange={(e) => {
            if (e.target.files) {
              uploadToFireBase(e.target.files[0]);
            }
          }}
        />
        <label
          htmlFor="add-to-bucket"
          className=" flex gap-4 items-center bg-orange-500 p-2 px-4 rounded-full hover:px-6 transition-all"
        >
          <p>Upload</p>
          <p className=" scale-75">
            <LucideUpload />
          </p>
        </label>
      </section>

      <section className=" max-w-[1700px] flex flex-col gap-2  py-4 banner w-full  rounded-2xl transition-all">
        <span className=" flex gap-4 py-4">
          <p>Files</p>
          <h6>Here is a list everything you have uploaded</h6>
        </span>
        <div>
          {bucketItems && bucketItems.length > 0 ? (
            <span className=" flex gap-4">
              {bucketItems.map((item, i) => {
                return (
                  <div
                    className=" relative h-[300px] rounded-2xl overflow-hidden "
                    key={i}
                  >
                    <img
                      alt="bucket item"
                      src={item}
                      className=" relative h-full"
                    />
                    <LucideTrash
                      className=" absolute bottom-2 right-2 cursor-pointer scale-75 hover:scale-100 transition-all"
                      // onClick={() => {
                      //   // Create a reference to the file to delete
                      //   const desertRef = ref(storage, ``);

                      //   // Delete the file
                      //   deleteObject(desertRef)
                      //     .then(() => {
                      //       // File deleted successfully
                      //     })
                      //     .catch((error) => {
                      //       // Uh-oh, an error occurred!
                      //     });
                      // }}
                    />
                  </div>
                );
              })}
            </span>
          ) : (
            <span className=" grid grid-cols-2 md:grid-cols-4 gap-4">
              {preloaderElements.map((item, i) => {
                return (
                  <div
                    className=" min-h-[200px] bg-neutral-900 rounded-2xl border border-neutral-800 animate-pulse "
                    key={i}
                  ></div>
                );
              })}
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

export default Bucket;
