import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import SnoutSVGLib from "./SnoutSVGLib";

const MintingAnimation = ({ address, level }) => {
  const [snoutParts, setSnoutParts] = useState([]);
  const [colors, setColors] = useState([]);
  const [key, setKey] = useState(0);
  const [snoutLib] = useState(() => new SnoutSVGLib());

  const shuffleColors = useCallback(() => {
    setColors((prevColors) => {
      const newColors = [...prevColors];
      for (let i = newColors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newColors[i], newColors[j]] = [newColors[j], newColors[i]];
      }
      return newColors;
    });
    setKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    const derivedColors = snoutLib.deriveColors(
      "0x62aC844c59257d3e922c98e6cC386Ce2aecBE797"
    );
    setColors(derivedColors);

    const rectString = snoutLib.getRectString(level);
    const parts = [];

    for (let i = 0; i < rectString.length; i += 6) {
      const rectData = rectString.slice(i, i + 6);
      const x = parseInt(rectData[0]);
      const y = parseInt(rectData[1]);
      const width = parseInt(rectData[2]);
      const height = parseInt(rectData[3]);
      const isShaded = rectData[4] === "-";
      const colorIndex = parseInt(rectData[5]);

      parts.push({ x, y, width, height, isShaded, colorIndex });
    }

    setSnoutParts(parts);
  }, [address, level, snoutLib]);

  useEffect(() => {
    const interval = setInterval(shuffleColors, 2000); // Reduced to 2 seconds
    return () => clearInterval(interval);
  }, [shuffleColors]);

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.02, // Reduced stagger time
      },
    },
  };

  const generateRectVariants = () => ({
    initial: {
      scale: 0,
      opacity: 0,
      rotate: Math.random() * 360,
    },
    animate: {
      scale: 0.8 + Math.random() * 0.4,
      opacity: 0.7 + Math.random() * 0.3,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200 + Math.random() * 300,
        damping: 10 + Math.random() * 15,
        repeat: 1,
        repeatType: "reverse",
        duration: 0.5 + Math.random() * 0.5,
        repeatDelay: 0.2,
      },
    },
  });

  return (
    <div className="relative h-64 w-64">
      <motion.svg
        key={key}
        viewBox="0 0 8 8"
        width="256"
        height="256"
        variants={containerVariants}
        animate="animate"
      >
        {snoutParts.map((part, index) => {
          let color = colors[part.colorIndex];
          if (part.isShaded) {
            color = snoutLib.shadeColor(color);
          }
          return (
            <motion.rect
              key={index}
              x={part.x}
              y={part.y}
              width={part.width}
              height={part.height}
              fill={`#${color}`}
              variants={generateRectVariants()}
              initial="initial"
              animate="animate"
            />
          );
        })}
      </motion.svg>
    </div>
  );
};

export default MintingAnimation;
