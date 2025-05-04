import React, { useState, useEffect, useRef } from "react";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  shape = "square",
  disableComposition = false,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const maxRetries = 3;

  const isComposite =
    typeof src === "object" &&
    src.background &&
    src.character &&
    !disableComposition;

  const shapeClasses = {
    square: "rounded-lg",
    circle: "rounded-full",
    hexagon: "mask mask-hexagon",
    squircle: "mask mask-squircle",
  };

  const shapeCls = shapeClasses[shape] || shapeClasses.square;

  useEffect(() => {
    if (hasError && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        setHasError(false);
        setRetryCount((prevCount) => prevCount + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasError, retryCount]);

  useEffect(() => {
    if (isComposite && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const loadAndDrawImage = (imageSrc, callback) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Important for CORS
        img.onload = () => callback(img);
        img.onerror = () => setHasError(true);
        img.src = imageSrc;
      };

      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
      } else {
        canvas.width = 300;
        canvas.height = 300;
      }

      setIsLoading(true);

      loadAndDrawImage(src.background, (bgImg) => {
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        loadAndDrawImage(src.character, (charImg) => {
          ctx.drawImage(charImg, 0, 0, canvas.width, canvas.height);
          setIsLoading(false);
          if (onLoad) onLoad();
        });
      });
    }
  }, [isComposite, src, onLoad]);

  if (hasError && retryCount >= maxRetries) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 ${shapeCls}`}
      >
        Failed to load
      </div>
    );
  }

  // For composite images, render a canvas
  if (isComposite) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {isLoading && (
          <div
            className={`absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 ${shapeCls}`}
          />
        )}
        <canvas
          ref={canvasRef}
          className={`h-full w-full ${shapeCls} ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
        />
      </div>
    );
  }

  // For regular images
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 ${shapeCls}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${shapeCls} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } pixel-art`}
        onLoad={() => {
          setIsLoading(false);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setHasError(true);
          if (onError) onError();
        }}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
