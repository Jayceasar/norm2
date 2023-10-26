/* eslint-disable @next/next/no-img-element */
"use client";

import "./styles.css";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import {
  FiUploadCloud,
  FiMusic,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiDownload,
} from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { IoPause, IoPlay } from "react-icons/io5";
import { ChromePicker, CompactPicker, TwitterPicker } from "react-color";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideMusic2,
  LucidePause,
  LucidePlay,
} from "lucide-react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import SendVideoRequest from "@/app/convert/SendVideoRequest";

function EditVideo({ params }) {
  const [scenes, setScenes] = useState([]);
  const [videoUrl, setVideoUrl] = useState();
  const [loadingStatus, setLoadingStatus] = useState("Download");
  const [downloadStatus, setDownloadStatus] = useState();
  const [history, setHistory] = useState([scenes]);
  const [pointInHistory, setPointInHistory] = useState(0);
  const [time, setTime] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);
  const [played, setPlayed] = useState(false);
  const [page, setPage] = useState("");
  const animationContainerRef = useRef();
  const lottieRef = useRef();
  const audioRef = useRef(null);
  const [selectedScene, setSelectedScene] = useState(0);
  const [selectedSceneAssets, setSelectedSceneAssets] = useState(null);
  const [objectSize, setObjectSize] = useState(null);
  const [selectedType, setSelectedType] = useState();
  const [selectedShape, setSelectedShape] = useState();
  const [selectedTextIndex, setSelectedTextIndex] = useState([]);
  const [shapeLayers, setShapeLayers] = useState([]);
  const [initailization, setInitailization] = useState(false);
  const { data: session } = useSession();
  const Id = params.projectId;
  console.log(downloadStatus);

  // get the project data first
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["animation"],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/${Id}`);
      return response.data;
    },
  });

  // check if the project has a download link for converting to video
  useEffect(() => {
    if (project?.firebaseJSONURL !== "") {
      setVideoUrl(project?.firebaseJSONURL);
    }
  }, [project]);

  //check if this the project owner
  // update to include collaborators later
  const projectOwner = project?.owner === session?.user.email;

  //check if the jsonData field in the project is empty. If it it, it means the project is just being created newly,
  //so go ahead and get the animation data for this new project

  const { mutate: updateProject, isLoading: isLoadingUpdateProject } =
    useMutation({
      mutationFn: async () => {
        const animationString = JSON.stringify(scenes[0]);
        console.log(animationString);

        // Use the PATCH method to update the project
        const response = await axios.patch(`/api/projects/${Id}`, {
          jsonData: animationString,
        });

        return response.data;
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        setInitailization(false);
      },
    });

  const { mutate: animationData, isLoading: isLoadingAnimationData } =
    useMutation({
      mutationFn: async (id) => {
        return axios.get(`/api/animation/${project?.template}`);
      },
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        console.log(data);
        const jsonObject = JSON.parse(data.data.jsonData);
        setScenes([jsonObject]);
      },
    });

  // make api call to get animation
  useEffect(() => {
    // console.log("started");
    if (projectOwner) {
      console.log("project owner true");
      if (!project) {
        console.log("no project");
        // Wait for project data to be available
        return;
      }

      if (!project.jsonData) {
        // console.log("animation isn't included yet");
        // If jsonData is not available, fetch animation data
        animationData(Number(Id));
        setInitailization(true);
      } else {
        // console.log("Animation has been included already");
        const jsonObject = JSON.parse(project.jsonData);
        // console.log(project.jsonData);
        setScenes([jsonObject]);
      }
    }
  }, [projectOwner, project]);

  // get use animation data we just requested to update the project jsonData field in the database
  useEffect(() => {
    // Check if animation data is available
    if (scenes && initailization) {
      updateProject();
    }
  }, [scenes]);

  //update selected text index when text is selected
  useEffect(() => {
    // console.log(selectedType);
    setSelectedTextIndex([]);
    selectedSceneAssets?.text?.forEach((text, i) => {
      if (text.t.d.k[0].s.t === selectedType?.txt) {
        setSelectedTextIndex((prev) => {
          return [...prev, i];
        });
      }
    });
  }, [selectedType]);

  useEffect(() => {
    if (Array.isArray(selectedType)) {
      const matchedObjects = shapeLayers?.filter((obj2) =>
        selectedType?.some((obj1) => obj1.strokewidth == obj2.width)
      );
      if (matchedObjects.length > 0) {
        setSelectedShape(matchedObjects);
      } else {
      }
    }
  }, [selectedType]);

  // add event listeners to svg elements in the dom so as to identify what element is being selected
  useEffect(() => {
    function addListeners() {
      const svgElements = document.querySelectorAll("svg > g");
      let currentSelectedG = null; // To keep track of the current selected <g> element

      const handleMouseClick = (event) => {
        setPage("Edit");
        setTime(lottieRef.current.currentFrame);
        lottieRef.current.pause();
        // audioRef.current.pause();
        setPaused(true);
        setPlayed(false);
        const parentGElement = event.target.closest("g");
        if (parentGElement) {
          parentGElement.style.stroke = "green";
          parentGElement.style.strokeWidth = "5";

          // Get bounding box of the parent <g> element
          const bbox = parentGElement.getBBox();

          setObjectSize({ w: bbox.width, h: bbox.height });

          // Remove previous rectangle from the previous selection
          if (currentSelectedG && currentSelectedG !== parentGElement) {
            removeRectangle(currentSelectedG);
          }

          // Create a new rectangle for the current selection with padding
          createRectangle(parentGElement, bbox, 10); // Adding 10 units of padding

          // Update the current selected <g> element
          currentSelectedG = parentGElement;
        }

        ////detect type
        //text
        const textElements = parentGElement.querySelectorAll("text");
        if (textElements.length > 0) {
          const layerText = parentGElement.getAttribute("aria-label");

          setSelectedTextIndex([]);
          setSelectedType({
            type: "text",
            txt: layerText,
          });
        }
        //image
        const imageElements = parentGElement.querySelectorAll("image");
        if (imageElements.length > 0) {
          setSelectedType({
            type: "image",
            img: imageElements[0].href.baseVal,
          });
        }

        //shapes
        const shapeElements = parentGElement.querySelectorAll("path");

        if (shapeElements.length > 0) {
          let attributes = [];
          setSelectedShape(null);

          shapeElements.forEach((shape) => {
            let type = shape.getAttribute("fill") ? "fill" : "stroke";
            const layerAttributes = {
              type,
              layers: shapeElements.length,
              fill: shape.getAttribute("fill"),
              strokewidth: shape.getAttribute("stroke-width"),
              stroke: shape.getAttribute("stroke"),
              strokeOpacity: shape.getAttribute("stroke-opacity"),
              strokeLinecap: shape.getAttribute("stroke-linecap"),
            };

            attributes.push(layerAttributes);
          });

          setSelectedType(attributes);
        }

        //solids
        const rectElements = parentGElement.querySelectorAll(
          "rect:not(#highlight)"
        );
        if (rectElements.length > 0) {
          setSelectedType({
            type: "solid",
            fill: rectElements[0].getAttribute("fill"),
          });
        }
      };

      const handleMouseOut = (event) => {
        const parentGElement = event.target.closest("g");
        if (parentGElement) {
          parentGElement.style.opacity = 1;
          parentGElement.style.stroke = "";
          parentGElement.style.strokeWidth = "0";
          setObjectSize(null);
        }
      };

      const createRectangle = (gElement, bbox, padding) => {
        const rectId = "highlight";

        // Check if a rectangle with the same ID already exists
        const existingRect = gElement.querySelector(`#${rectId}`);
        if (existingRect) {
          return; // Return early if a rectangle already exists
        }

        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );

        // Calculate the dimensions including padding
        const paddedWidth = bbox.width + 2 * padding;
        const paddedHeight = bbox.height + 2 * padding;

        // Calculate the position with padding
        const xPosition = bbox.x - padding;
        const yPosition = bbox.y - padding;

        rect.setAttribute("id", rectId);
        rect.setAttribute("x", xPosition);
        rect.setAttribute("y", yPosition);
        rect.setAttribute("width", paddedWidth);
        rect.setAttribute("height", paddedHeight);
        rect.setAttribute("stroke", "white");
        rect.setAttribute("stroke-width", "2");
        rect.setAttribute("stroke-dasharray", "4 2"); // Dash length followed by gap length
        rect.style.mixBlendMode = "exclusion";
        rect.setAttribute("fill", "transparent");

        gElement.appendChild(rect);
      };

      const removeRectangle = (gElement) => {
        const rect = gElement.querySelector("#highlight"); // Select the rectangle by its ID
        if (rect) {
          gElement.removeChild(rect);
        }
      };

      svgElements.forEach((topGElement) => {
        topGElement.addEventListener("click", handleMouseClick);
        topGElement.addEventListener("mouseout", handleMouseOut);
      });

      // Clean up by removing event listeners when the component unmounts
      return () => {
        svgElements.forEach((topGElement) => {
          topGElement.removeEventListener("click", handleMouseClick);
          topGElement.removeEventListener("mouseout", handleMouseOut);
        });
      };
    }
    addListeners();
  }, [scenes, count]);

  ///find layers that a user should be able to edit
  useEffect(() => {
    let editableAssets = {
      images: [],
      text: [],
      shapes: [],
      solids: [],
    };

    const images = scenes[count]?.assets?.filter((asset) =>
      asset.hasOwnProperty("w")
    );
    const text = scenes[count]?.layers?.filter((layer) => layer.ty === 5);
    const shapes = scenes[count]?.layers?.filter((layer) => layer.ty === 4);
    const solids = scenes[count]?.layers?.filter((layer) => layer.ty === 1);

    editableAssets.images = images;
    editableAssets.text = text;
    editableAssets.shapes = shapes;
    editableAssets.solids = solids;

    setSelectedSceneAssets(editableAssets);
  }, [selectedScene, scenes, project]);

  // save project to firebase

  async function saveProject() {
    console.log("started save");
    const currentScenes = [...scenes];
    try {
      setLoadingStatus("Saving project...");

      // Upload scenes and update Firestore
      const uploadPromises = currentScenes.map(async (scene, i) => {
        const storageRef = ref(storage, `team-projects/${project.id}/${i}`);
        const file = JSON.stringify(scene);

        try {
          await uploadString(storageRef, file);
          // Get the download URL for the uploaded file
          const downloadURL = await getDownloadURL(storageRef);
          setVideoUrl(downloadURL);
          console.log("Download URL:", downloadURL);
        } catch (error) {
          console.error("Error uploading scene:", error);
          throw error; // Rethrow the error to halt the process if an upload fails
        }
      });

      // Wait for all upload promises to resolve
      await Promise.all(uploadPromises);

      // All uploads are successful
      setLoadingStatus("converting video");
    } catch (error) {
      console.error("Error saving project:", error);
      setLoadingStatus("Download");
      // Handle any error related to saving the project here
    }
  }

  // download video
  async function downloadVideo() {
    try {
      await saveProject(); // Wait for saveProject to complete
      // Now that saveProject is done, you can access the videoUrl
      const response = await axios.patch(`/api/projects/${project?.id}`, {
        firebaseJSONURL: videoUrl,
      });
      if (response.status === 200) {
        console.log("done");
        setLoadingStatus("Download");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function rgbToHex(r, g, b) {
    const toHex = (value) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");

    const r = (parseInt(hex.substring(0, 2), 16) / 255).toFixed(3);
    const g = (parseInt(hex.substring(2, 4), 16) / 255).toFixed(3);
    const b = (parseInt(hex.substring(4, 6), 16) / 255).toFixed(3);

    return [parseFloat(r), parseFloat(g), parseFloat(b)];
  }

  function rgbaArrayToHex(rgbaArray) {
    if (!Array.isArray(rgbaArray) || rgbaArray.length !== 4) {
      throw new Error("Invalid RGBA array format");
    }

    const [r, g, b, a] = rgbaArray.map((value) => {
      if (typeof value !== "number" || value < 0 || value > 1) {
        throw new Error("Invalid RGBA color values");
      }
      return Math.round(value * 255);
    });

    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    return `#${hexR}${hexG}${hexB}`;
  }

  function hexToRgbaArray(hex) {
    // Remove the '#' character if present
    if (hex.startsWith("#")) {
      hex = hex.slice(1);
    }

    // Convert hex to RGBA values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const a = 1; // Alpha value is set to 1

    return [r, g, b, a];
  }

  function updateHistory() {
    setHistory((prev) => {
      // Create a new copy of scenes by first converting to JSON and then parsing it back
      const newScenes = JSON.parse(JSON.stringify(scenes));
      const newHistory = [...prev, newScenes];

      // Check if the length of history exceeds 30, and if so, remove the oldest entries
      if (newHistory.length > 30) {
        return newHistory.slice(newHistory.length - 15);
      }

      return newHistory;
    });
    setPointInHistory(history.length);
  }

  function updateTextAndColor(e, ind, type) {
    // console.log(e?.target?.value);
    lottieRef.current.goToAndStop(50);
    setScenes((prev) => {
      const updatedScenes = [...prev]; // Create a copy of the scenes array
      const oldData = { ...updatedScenes[count] }; // Copy the selected scene's data
      const updatedLayers = oldData.layers.map((layer) => {
        if (layer.ind === ind) {
          let newTextLayer = { ...layer };
          if (type === "text") {
            newTextLayer.t.d.k[0].s.t = e.target.value;
          } else {
            const newColor = hexToRgb(e);
            // console.log(newColor);
            newTextLayer.t.d.k[0].s.fc = newColor;
          }

          return newTextLayer;
        }
        return layer;
      });

      oldData.layers = updatedLayers; // Update the layers array in oldData
      updatedScenes[count] = oldData; // Update the selected scene in the copy of scenes array

      return updatedScenes; // Return the updated scenes array
    });
    updateHistory();
  }

  function updateImage(e, id) {
    // console.log(id);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const base64Image = readerEvent.target.result;
        // Now you have the image in base64 format, you can use it as needed
        // console.log(base64Image);
        if (base64Image) {
          setScenes((prevScenes) => {
            const updatedScenes = [...prevScenes]; // Create a copy of the scenes array

            const oldData = { ...updatedScenes[count] }; // Copy the selected scene's data

            const updatedAssets = oldData.assets.map((asset) => {
              if (asset.id === id) {
                let newAsset = { ...asset };
                newAsset.p = base64Image;

                return newAsset;
              }
              return asset;
            });

            oldData.assets = updatedAssets;
            updatedScenes[count] = oldData;

            return updatedScenes;
          });
        }
        // You can set the base64Image to state, send it to a server, etc.
      };

      reader.readAsDataURL(file);
    }
    updateHistory();
  }

  function updateShapes(color, shape, i) {
    const { type, shapeLayerIndex, elementIndex, itemIndex, identifier } =
      shape;

    setScenes((prev) => {
      const updatedScenes = [...prev]; // Create a copy of the scenes array
      const oldData = { ...updatedScenes[count] }; // Copy the selected scene's data
      oldData.layers = oldData.layers.map((layer) => {
        if (layer.ind === identifier) {
          const updatedLayer = { ...layer };
          updatedLayer.shapes[elementIndex].it[itemIndex].c.k =
            hexToRgbaArray(color);

          return updatedLayer;
        }
        return layer;
      });

      updatedScenes[count] = oldData; // Update the selected scene in the copy of scenes array

      return updatedScenes; // Return the updated scenes array
    });

    setSelectedShape((prev) => {
      let previousShapeData = [...prev];
      previousShapeData[i].color = hexToRgbaArray(color);
      return previousShapeData;
    });

    updateHistory();
  }

  function undo() {
    if (pointInHistory > 1) {
      const newPointInHistory = pointInHistory - 1;
      setPointInHistory(newPointInHistory);
      setScenes(history[newPointInHistory]);
    }
  }

  function redo() {
    if (pointInHistory < history.length - 1) {
      const newPointInHistory = pointInHistory + 1;
      setPointInHistory(newPointInHistory);
      setScenes(history[newPointInHistory]);
    }
  }

  function updateSolids(color, i) {
    setScenes((prev) => {
      const updatedScenes = [...prev]; // Create a copy of the scenes array
      const oldData = { ...updatedScenes[count] }; // Copy the selected scene's data
      oldData.layers = oldData.layers.map((layer) => {
        if (layer.sc === selectedType.fill) {
          const updatedLayer = { ...layer };
          updatedLayer.sc = color;

          return updatedLayer;
        }
        return layer;
      });

      updatedScenes[count] = oldData; // Update the selected scene in the copy of scenes array

      return updatedScenes; // Return the updated scenes array
    });
    setSelectedType({
      type: "solid",
      fill: color,
    });

    updateHistory();
  }

  useEffect(() => {
    const neededShapes = [];
    selectedSceneAssets?.shapes?.map((shapeLayer, shapeLayerIndex) => {
      shapeLayer.shapes.forEach((element, elementIndex) => {
        element.it?.forEach((item, itemIndex) => {
          if (item.ty === "fl" || item.ty === "st") {
            if (item.ty === "st") {
              neededShapes.push({
                identifier: shapeLayer.ind,
                name: shapeLayer.nm,
                type: "stroke",
                color: item.c.k, // stroke color
                width: item.w.k, // stroke width
                ip: shapeLayer.ip, // shape in point
                op: shapeLayer.op, // shape out point
                shapeLayerIndex,
                elementIndex,
                itemIndex,
              });
            }
            if (item.ty === "fl") {
              neededShapes.push({
                identifier: shapeLayer.ind,
                name: shapeLayer.nm,
                type: "fill",
                color: item.c.k, // fill color
                ip: shapeLayer.ip, // shape in point
                op: shapeLayer.op, // shape out point
                shapeLayerIndex,
                elementIndex,
                itemIndex,
              });
            }
          }
        });
      });
    });
    setShapeLayers(neededShapes);
  }, [selectedSceneAssets]);

  //UI elements
  // const scenesView = (
  //   <section className="">
  //     <p className=" text-xs text-neutral-400">
  //       Click on any scene to add to your project
  //     </p>
  //     <span className="">
  //       {products?.map((product, i) => {
  //         const { name, coverImage } = product;
  //         return (
  //           <button
  //             key={i}
  //             onClick={() => {
  //               addScene(product);
  //             }}
  //           >
  //             <img alt={product.name} src={product.cover} />
  //             <p>{product?.title} </p>
  //           </button>
  //         );
  //       })}
  //     </span>
  //   </section>
  // );

  const ScenesTabs = (
    <div className=" scenes-tabs">
      {/* for the clickable scenes tabs */}
      <p>Scenes</p>
      <span>
        {scenes?.map((scene, i) => {
          return (
            <div
              key={i}
              className={` ${
                count === i ? "bg-white" : " bg-neutral-500"
              } w-full aspect-[5/2]  rounded-xl`}
            >
              <div
                className=" w-full h-full "
                onClick={() => {
                  setPlayed(true);
                  setCount(i);
                  setSelectedScene(i);
                  setPaused(false);
                  setTime(0);

                  lottieRef.current.goToAndPlay(0, true);
                  if (count === 0) {
                    audioRef.current.currentTime = 0;
                  }
                }}
              ></div>
            </div>
          );
        })}
        <button
          onClick={() => {
            setPage("Add scenes");
          }}
        >
          +
        </button>
      </span>
    </div>
  );

  const selectedObject = (
    <div className=" selected-object-container">
      <p className="">Selected object</p>
      {selectedType?.type === "image" && (
        <div>
          {selectedSceneAssets?.images?.map((img, i) => {
            if (img.p === selectedType?.img) {
              return (
                <div key={i}>
                  <input
                    style={{ width: "0%", height: " 0%" }}
                    type="file"
                    accept="image/*"
                    id={`image-input-${i}`}
                    onChange={(e) => updateImage(e, img.id)}
                  />
                  <label
                    style={{
                      display: "flex",
                      height: "100%",
                      overflow: "hidden",
                    }}
                    className=" image-label"
                    htmlFor={`image-input-${i}`}
                  >
                    <img
                      style={{ maxHeight: "200px", borderRadius: "1rem" }}
                      alt="selected-image"
                      src={img.p}
                    />
                  </label>
                </div>
              );
            }
          })}
        </div>
      )}
      {selectedType?.type === "text" && (
        <div className=" flex justify-between ">
          {selectedTextIndex?.map((ind, i) => {
            const textLayer = selectedSceneAssets?.text[ind];
            if (textLayer) {
              return (
                <div key={i}>
                  <Input
                    type="text"
                    placeholder={textLayer?.t.d.k[0].s.t}
                    defaultValue={textLayer?.t.d.k[0].s.t}
                    onChange={(e) => {
                      updateTextAndColor(e, textLayer.ind, "text");
                    }}
                  />

                  <ChromePicker
                    className=" h-fit"
                    disableAlpha={true}
                    color={rgbToHex(
                      textLayer?.t.d.k[0].s.fc[0],
                      textLayer?.t.d.k[0].s.fc[1],
                      textLayer?.t.d.k[0].s.fc[2]
                    )}
                    onChangeComplete={(color) => {
                      // console.log(textLayer?.t.d.k[0].s.fc, color);
                      // console.log(rgbToHex(textLayer?.t.d.k[0].s.fc));
                      updateTextAndColor(color.hex, textLayer.ind, "color");
                    }}
                  />
                </div>
              );
            }
          })}
        </div>
      )}
      {Array.isArray(selectedType) && (
        <div className=" grid grid-cols-4 gap-4">
          {selectedShape?.map((shape, i) => {
            return (
              <div key={i} className=" relative w-full aspect-square flex">
                <input
                  id={`shapeLayer-${i}`}
                  type="color"
                  style={{ display: "none" }}
                  defaultValue={rgbaArrayToHex(shape.color)}
                  onChange={(e) => {
                    updateShapes(e, shape, i);
                  }}
                  className=" w-0 h-0 rounded-full"
                />

                <ChromePicker
                  className=" h-fit"
                  disableAlpha={true}
                  color={rgbaArrayToHex(shape.color)}
                  onChangeComplete={(color) => {
                    console.log(shape);
                    updateShapes(color.hex, shape, i);
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      {selectedSceneAssets?.solids?.map((solid, i) => {
        if (solid.sc === selectedType?.fill) {
          return (
            <div key={i} className=" flex">
              <ChromePicker
                className=" h-fit"
                disableAlpha={true}
                color={solid.sc}
                onChangeComplete={(color) => {
                  updateSolids(color.hex, i);
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
  const playPauseMusic = (
    <div className=" flex items-center ">
      <div
        className=" flex flex-col h-12 aspect-square  items-center justify-center bg-orange-500 rounded-full border-0 hover:border-2 hover:border-white transition-all "
        onClick={() => {
          if (paused) {
            setPlayed(true);
            setPaused(false);
            audioRef.current.play();
            lottieRef.current.play();
          } else {
            setPlayed(false);
            setPaused(true);
            audioRef.current.pause();
            lottieRef.current.pause();
            setTime(lottieRef.current.currentFrame);
          }
        }}
      >
        <div className=" text-black text-lg">
          {paused ? <IoPlay /> : <IoPause />}
        </div>
      </div>
      <div className=" text-white p-6 bg-neutral-800 rounded-full scale-75 border-0 hover:bg-neutral-400 hover:border-2 hover:border-white transition-all ">
        <FiMusic />
      </div>
    </div>
  );

  const addScenesContainer = <section style={{ width: "100%" }}></section>;
  return (
    <main>
      <div className=" container">
        <section className=" top-dashboard">
          <span>
            <div onClick={undo}>
              <LucideChevronLeft />
            </div>
            <div onClick={redo}>
              <LucideChevronRight />
            </div>
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {project?.title ? <p>{project.title}</p> : <p>untitled</p>}project
          </div>
        </section>
        <section className=" edit-area-container ">
          <span className=" preview-container">
            {project?.jsonData && (
              <div className=" play-pause-music">
                <button
                  style={{
                    padding: "10px",
                    backgroundColor: "#FF5C00",
                    borderRadius: "9999px",
                  }}
                  onClick={() => {
                    if (paused) {
                      lottieRef.current.play();
                      setPaused(false);
                    } else {
                      lottieRef.current.pause();
                      setPaused(true);
                    }
                  }}
                >
                  {paused ? <LucidePlay /> : <LucidePause />}
                </button>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#464646",
                    borderRadius: "9999px",
                  }}
                >
                  <LucideMusic2 />
                </div>
              </div>
            )}
            {projectOwner ? (
              <div className="lottie-parent">
                <div
                  ref={animationContainerRef}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    maxWidth: "1400px",
                    aspectRatio: `${scenes[count]?.w / scenes[count]?.h}`,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "fit-content",
                      maxWidth: "1200px",
                    }}
                  >
                    <Lottie
                      ref={lottieRef}
                      play={played}
                      goto={time}
                      goTo={time}
                      loop={scenes.length <= 1 ? true : false}
                      animationData={scenes[count]}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        backgroundColor:
                          scenes.length > 0 ? "white" : "transparent",
                      }}
                      className={` lottie ${
                        scenes.length > 0 ? "bg-white" : "bg-transparent"
                      } cursor-pointer `}
                      onLoopComplete={() => {
                        if (count === scenes?.length - 1) {
                          // audioRef.current.currentTime = 0;
                        }
                      }}
                      onComplete={() => {
                        setTime(0);
                        if (count === scenes?.length - 1) {
                          audioRef.current.currentTime = 0;
                          setCount(0);
                        } else {
                          setCount((prev) => {
                            return prev + 1;
                          });
                        }
                      }}
                    >
                      <div className=" flex gap-4 items-center">
                        <p className=" text-white">Loading...</p>
                        <div className=" w-6 aspect-square border-4 border-orange-400 border-t-orange-200 rounded-full animate-spin "></div>
                      </div>
                    </Lottie>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {isLoadingProject && <p>Loading project...</p>}{" "}
                {project && !projectOwner && (
                  <div>You do not have access to this project</div>
                )}
              </div>
            )}
          </span>
          <span className=" sidebar-container ">
            <span style={{ height: "40%", overflow: "hidden" }}>
              {ScenesTabs}
              {selectedObject}
            </span>

            <span style={{ height: "60%" }}>
              Add new scenes
              <h2>Select a new scene to add to this project</h2>
              {addScenesContainer}
            </span>

            {project?.jsonData && (
              <Button
                style={{ position: "relative", overflow: "hidden" }}
                onClick={async () => {
                  await downloadVideo();
                  SendVideoRequest(
                    videoUrl,
                    scenes[0].w,
                    scenes[0].h,
                    scenes[0].fr,
                    scenes[0].op,
                    setDownloadStatus
                  );
                }}
              >
                <div style={{ zIndex: "3000" }}>{loadingStatus}</div>
                <div
                  style={{
                    backgroundColor: "orange",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: `${
                      downloadStatus?.jobstatus === "pending" ||
                      downloadStatus?.jobstatus === "done"
                        ? "0%"
                        : downloadStatus?.jobstatus
                    }`,
                    transition: "all",
                  }}
                ></div>
              </Button>
            )}
          </span>
        </section>
      </div>
    </main>
  );
}

export default EditVideo;
