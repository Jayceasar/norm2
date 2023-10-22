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

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

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

export default addListeners;
