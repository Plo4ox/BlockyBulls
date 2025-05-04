import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Cube = ({ size, x, y, color, depth, isMaxDepth }) => {
  return (
    <motion.div
      className="cube"
      style={{
        width: size,
        height: size,
        position: "absolute",
        left: x,
        top: y,
        transformStyle: "preserve-3d",
        transform: `translateZ(${depth}px)`,
        borderRadius: "50%",
        overflow: "hidden",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isMaxDepth ? { scale: 1.1, rotate: 5 } : {}}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: color,
          borderRadius: "50%",
        }}
        animate={isMaxDepth ? { rotate: [0, 5, -5, 0] } : {}}
        transition={isMaxDepth ? { repeat: Infinity, duration: 1 } : {}}
      />
    </motion.div>
  );
};

const RevealTheBull = ({ imgSrc }) => {
  const [cubes, setCubes] = useState([]);
  const [containerSize, setContainerSize] = useState(479);
  const minCubeSize = 16;
  const maxDepth = 6;
  const cubeSpacing = 4;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const lastInteractedCubeRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      const newSize = Math.min(
        479,
        Math.min(window.innerWidth, window.innerHeight) - 40
      );
      setContainerSize(newSize);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = containerSize;
      canvas.height = containerSize;
      const ctx = canvas.getContext("2d");

      // Disable image smoothing to maintain pixel art quality
      ctx.imageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;

      ctx.drawImage(img, 0, 0, containerSize, containerSize);
      canvasRef.current = canvas;
      initializeCubes(containerSize, 0);
    };
    img.src = imgSrc;
  }, [imgSrc, containerSize]);

  const initializeCubes = (size, depth) => {
    const newCubes = [];
    for (let y = 0; y < containerSize; y += size + cubeSpacing) {
      for (let x = 0; x < containerSize; x += size + cubeSpacing) {
        newCubes.push({
          x,
          y,
          size,
          color: getAverageColor(x, y, size),
          depth,
        });
      }
    }
    setCubes(newCubes);
  };

  const getAverageColor = (x, y, size) => {
    if (!canvasRef.current) return "rgba(59, 130, 246, 0.5)";

    const ctx = canvasRef.current.getContext("2d");
    const imageData = ctx.getImageData(x, y, size, size).data;

    let r = 0,
      g = 0,
      b = 0,
      a = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
      a += imageData[i + 3];
    }
    const pixelCount = imageData.length / 4;
    return `rgba(${Math.round(r / pixelCount)}, ${Math.round(
      g / pixelCount
    )}, ${Math.round(b / pixelCount)}, ${a / (pixelCount * 255)})`;
  };

  const handleCubeInteract = (x, y) => {
    const interactedCube = cubes.find(
      (cube) =>
        x >= cube.x &&
        x < cube.x + cube.size &&
        y >= cube.y &&
        y < cube.y + cube.size
    );

    if (!interactedCube || interactedCube === lastInteractedCubeRef.current)
      return;

    lastInteractedCubeRef.current = interactedCube;

    if (interactedCube.size > minCubeSize && interactedCube.depth < maxDepth) {
      const { x, y, size, depth } = interactedCube;

      const centerX = x + size / 2;
      const centerY = y + size / 2;

      const newSize = size / 2;
      const newDepth = depth + 1;

      const newCubes = cubes.flatMap((cube) =>
        cube === interactedCube
          ? [
              {
                x: centerX - newSize,
                y: centerY - newSize,
                size: newSize,
                color: getAverageColor(x, y, newSize),
                depth: newDepth,
              },
              {
                x: centerX,
                y: centerY - newSize,
                size: newSize,
                color: getAverageColor(x + newSize, y, newSize),
                depth: newDepth,
              },
              {
                x: centerX - newSize,
                y: centerY,
                size: newSize,
                color: getAverageColor(x, y + newSize, newSize),
                depth: newDepth,
              },
              {
                x: centerX,
                y: centerY,
                size: newSize,
                color: getAverageColor(x + newSize, y + newSize, newSize),
                depth: newDepth,
              },
            ]
          : [cube]
      );
      setCubes(newCubes);
    }
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleCubeInteract(x, y);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    handleCubeInteract(x, y);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: containerSize,
        height: containerSize,
        position: "relative",
        margin: "auto",
        touchAction: "none",
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
    >
      <AnimatePresence>
        {cubes.map((cube, index) => (
          <Cube
            key={`${cube.x}-${cube.y}-${cube.size}-${cube.depth}`}
            {...cube}
            isMaxDepth={cube.depth === maxDepth || cube.size === minCubeSize}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RevealTheBull;
