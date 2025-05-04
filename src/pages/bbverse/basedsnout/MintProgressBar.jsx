import React, { useState, useEffect } from "react";
import SnoutSVGLib from "./SnoutSVGLib";
import "./MintProgressBar.css";

const MintProgressBar = ({ mintCount, userAddress }) => {
  if (mintCount === undefined || userAddress === undefined) return null;
  const progress = (mintCount / 4) * 100;
  const [animationLevel, setAnimationLevel] = useState(0);

  const milestones = [
    { position: 25, level: 0 },
    { position: 50, level: 1 },
    { position: 75, level: 2 },
    { position: 100, level: 3 },
  ];

  const renderSnoutSVG = (level, size, svgSize) => {
    try {
      const snoutLib = new SnoutSVGLib();
      const svg = snoutLib.generateSVG(level, userAddress, svgSize, svgSize);
      return <div dangerouslySetInnerHTML={{ __html: svg }} className={size} />;
    } catch (error) {
      console.error(`Error generating SVG for level ${level}:`, error);
      return <></>;
    }
  };

  useEffect(() => {
    if (mintCount === 4) {
      const animationSequence = [0, 1, 2, 3, 2, 3, 2, 3];
      let index = 0;
      const intervalId = setInterval(() => {
        setAnimationLevel(animationSequence[index]);
        index = (index + 1) % animationSequence.length;
      }, 500);

      return () => clearInterval(intervalId);
    }
  }, [mintCount]);

  return (
    <div className="mb-2 mt-12 w-full">
      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
            style={{ left: `${milestone.position}%` }}
          >
            {index < mintCount ? (
              <div className="h-16 w-16 animate-pulse">
                {renderSnoutSVG(milestone.level, "w-16 h-16", 64)}
              </div>
            ) : (
              <div
                className={`h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 ${
                  index === mintCount ? "animate-pulse-glow" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-6 text-start text-sm">
        {mintCount < 4 && (
          <span className="block text-blue-500">
            Minted {mintCount}/4 Snouts
          </span>
        )}
      </p>
      {mintCount === 4 && (
        <>
          <p className="mt-10 text-center text-sm font-bold text-blue-500">
            Congratulations! You've minted all your Snouts!
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-32 w-32">
              {renderSnoutSVG(animationLevel, "w-32 h-32", 128)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MintProgressBar;
