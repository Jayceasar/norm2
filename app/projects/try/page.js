"use client";

import { Button } from "@/components/ui/button";
import { storage } from "@/firebase/firebaseConfig";
import { ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  FiUploadCloud,
  FiMusic,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiDownload,
} from "react-icons/fi";
import Lottie from "react-lottie-player";
import { Input } from "@/components/ui/input";
import dottedPattern from "@/app/json/dotted-pattern.png";
import Image from "next/image";
import { FiFeather } from "react-icons/fi";
import { TbLayoutGridAdd } from "react-icons/tb";
import { FiInbox } from "react-icons/fi";
import { ImDownload } from "react-icons/im";
import { IoPause, IoPlay } from "react-icons/io5";
import { ChromePicker, CompactPicker, TwitterPicker } from "react-color";
import loaderAnimation from "@/app/json/loading.gif";

function EditVideo({ params }) {
  const [savingProject, setSavingProject] = useState(false);
  const [rendering, setRendering] = useState(0);
  const [duration, setDuration] = useState(0);
  const [url, setUrl] = useState();
  const [project, setProject] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [history, setHistory] = useState([scenes]);
  const [pointInHistory, setPointInHistory] = useState(0);
  const [time, setTime] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);
  const [played, setPlayed] = useState(false);
  const [page, setPage] = useState("");
  const [pages, setPages] = useState([
    { title: "Edit", icon: FiFeather },
    { title: "Add scenes", icon: TbLayoutGridAdd },
    { title: "Bucket", icon: FiInbox },
    { title: "Download", icon: ImDownload },
  ]);
  const [products, setProducts] = useState(null);
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

  //update selected text index when text is selected
  useEffect(() => {
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
      console.log("event listener");
      const svgElements = document.querySelectorAll("svg > g");
      let currentSelectedG = null; // To keep track of the current selected <g> element

      const handleMouseClick = (event) => {
        setPage("Edit");
        setTime(lottieRef.current.currentFrame);
        lottieRef.current.pause();
        audioRef.current.pause();
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
  }, [selectedScene, scenes, count]);

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

  function updateShapes(e, shape, i) {
    const { type, shapeLayerIndex, elementIndex, itemIndex, identifier } =
      shape;
    const { value } = e.target;

    setScenes((prev) => {
      const updatedScenes = [...prev]; // Create a copy of the scenes array
      const oldData = { ...updatedScenes[count] }; // Copy the selected scene's data
      oldData.layers = oldData.layers.map((layer) => {
        if (layer.ind === identifier) {
          const updatedLayer = { ...layer };
          updatedLayer.shapes[elementIndex].it[itemIndex].c.k =
            hexToRgbaArray(value);

          return updatedLayer;
        }
        return layer;
      });

      updatedScenes[count] = oldData; // Update the selected scene in the copy of scenes array

      return updatedScenes; // Return the updated scenes array
    });

    setSelectedShape((prev) => {
      let previousShapeData = [...prev];
      previousShapeData[i].color = hexToRgbaArray(value);
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
  const scenesView = (
    <section className=" hidden md:flex flex-col gap-4 relative">
      <p className=" text-xs text-neutral-400">
        Click on any scene to add to your project
      </p>
      <span className=" grid grid-cols-2 gap-4">
        {products?.map((product, i) => {
          const { name, coverImage } = product;
          return (
            <button
              key={i}
              onClick={() => {
                addScene(product);
              }}
            >
              <img alt={product.name} src={product.coverImage} />
            </button>
          );
        })}
      </span>
    </section>
  );

  const ScenesTabs = (
    <div className="  w-full flex flex-col gap-1  ">
      {/* for the clickable scenes tabs */}
      <p>Scenes</p>
      <span className=" grid grid-cols-4 gap-2 w-full h-full bg-neutral-800 overflow-scroll  rounded-xl p-4">
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
          className="w-full flex items-center justify-center aspect-[5/2] bg-neutral-500  rounded-xl"
        >
          +
        </button>
      </span>
    </div>
  );
  const selectedObject = (
    <section className=" flex flex-col gap-2 selected-part w-full  rounded-2xl transition-all bg-red">
      <p className=" hidden md:flex">Selected object</p>
      {selectedType?.type === "image" && (
        <div className=" w-full h-[8vh] md:h-[17vh]">
          {selectedSceneAssets?.images?.map((img, i) => {
            if (img.p === selectedType?.img) {
              return (
                <div
                  key={i}
                  className=" relative w-full h-full overflow-hidden"
                >
                  <input
                    type="file"
                    accept="image/*"
                    className=" hidden absolute top-0 right-0 w-full h-full  "
                    id={`image-input-${i}`}
                    onChange={(e) => updateImage(e, img.id)}
                  />
                  <label
                    htmlFor={`image-input-${i}`}
                    className="absolute top-0 right-0 w-full h-full"
                  ></label>

                  <div className=" flex w-full h-full">
                    <img src={img.p} className=" h-full" />
                  </div>
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
                <div
                  key={i}
                  className=" w-full grid grid-cols-2 items-center justify-center gap-4"
                >
                  <Input
                    type="text"
                    placeholder={textLayer?.t.d.k[0].s.t}
                    defaultValue={textLayer?.t.d.k[0].s.t}
                    className=" col-span-7 p-4 bg-neutral-700"
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
                  defaultValue={rgbaArrayToHex(shape.color)}
                  onChange={(e) => {
                    updateShapes(e, shape, i);
                  }}
                  className=" w-0 h-0 rounded-full"
                />
                <label
                  htmlFor={`shapeLayer-${i}`}
                  className=" w-full aspect-square rounded-full bg-red-600 border-2 border-white"
                  style={{
                    backgroundColor: rgbaArrayToHex(shape.color),
                  }}
                ></label>
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
    </section>
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
  return (
    <div className=" fixed top-0 w-full h-screen bg-black text-white">
      hello
    </div>
  );
}

export default EditVideo;
