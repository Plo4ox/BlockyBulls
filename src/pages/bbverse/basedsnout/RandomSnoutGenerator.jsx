import React, { useState, useEffect } from "react";
import SnoutSVGLib from "./SnoutSVGLib";
import ColoredAddress from "./ColorAddress";

function RandomSnoutGenerator({ mintCount }) {
  const [snoutSVG, setSnoutSVG] = useState("");
  const [address, setAddress] = useState("");
  const [level, setLevel] = useState(0);

  const generateRandomSnout = () => {
    const newLevel = Math.floor(
      Math.random() * (mintCount ? mintCount + 1 : 1)
    );
    const { svg, address } = SnoutSVGLib.generateRandomSnout(newLevel);
    setSnoutSVG(svg);
    setAddress(address);
    setLevel(newLevel);
  };

  useEffect(() => {
    generateRandomSnout();

    const intervalId = setInterval(() => {
      generateRandomSnout();
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="h-64 w-64">
        {snoutSVG && <div dangerouslySetInnerHTML={{ __html: snoutSVG }} />}
      </div>
      <p className="!mt-4 text-sm text-gray-600 dark:text-gray-400">
        Level: {level}
      </p>
      <p className="!mt-2 max-w-xs break-all text-center text-xs font-semibold text-gray-500 dark:text-gray-500">
        <ColoredAddress address={address} />
      </p>
    </div>
  );
}

export default RandomSnoutGenerator;
