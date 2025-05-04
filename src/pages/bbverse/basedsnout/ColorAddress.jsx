import React from "react";

const ColoredAddress = ({ address }) => {
  const colorGroups = [
    address.slice(0, 2), // '0x' prefix
    ...Array(6)
      .fill()
      .map((_, i) => address.slice(2 + i * 6, 2 + (i + 1) * 6)),
    address.slice(38, 42) + "..", // Last group with '..' instead of '00'
  ];

  return (
    <span className="break-all font-mono text-xs">
      {colorGroups.map((group, index) => (
        <span
          key={index}
          className={index === 0 ? "text-gray-500" : ""}
          style={index > 0 ? { color: `#${group.replace("..", "00")}` } : {}}
        >
          {group}
        </span>
      ))}
    </span>
  );
};

export default ColoredAddress;
