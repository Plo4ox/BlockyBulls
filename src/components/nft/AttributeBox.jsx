// src/components/nft/AttributeBox.jsx

import React, { useState, useEffect } from "react";
import { resolveAddressToName } from "../../lib/utils/nameResolver";
import FormattedAddressLink from "../ui/FormattedAddressLink";
import client from "../../lib/client";

/**
 * Component for displaying a single NFT attribute
 *
 * @param {Object} props - Component props
 * @param {string} props.traitType - The attribute type/category
 * @param {string|number} props.value - The attribute value
 * @param {string} props.frequency - Optional rarity frequency
 * @param {string} props.className - Optional additional CSS classes
 */
const AttributeBox = ({ traitType, value, frequency, className = "" }) => {
  const [resolvedValue, setResolvedValue] = useState(value);

  // If the value is an Ethereum address, try to resolve it to a name
  useEffect(() => {
    const resolveAddressIfNeeded = async () => {
      if (
        value &&
        typeof value === "string" &&
        value.startsWith("0x") &&
        value.length === 42
      ) {
        const resolvedName = await resolveAddressToName(client, value);
        if (resolvedName) {
          setResolvedValue(
            <FormattedAddressLink
              address={value}
              name={resolvedName}
              useAccountPage={true}
            />
          );
        }
      }
    };

    resolveAddressIfNeeded();
  }, [value]);

  // Determine if the value should be displayed with special formatting
  const isSpecialValue = typeof resolvedValue === "object"; // React element

  // Determine the appropriate color based on rarity or trait type
  const getBackgroundColor = () => {
    // You can implement logic here to color-code attributes by rarity
    // For now, we'll use a simple mapping based on trait type
    const traitTypeColors = {
      Background: "bg-purple-800/40 border-purple-700/50",
      Eyes: "bg-blue-800/40 border-blue-700/50",
      Mouth: "bg-pink-800/40 border-pink-700/50",
      Fur: "bg-amber-800/40 border-amber-700/50",
      Clothes: "bg-green-800/40 border-green-700/50",
      Head: "bg-red-800/40 border-red-700/50",
      Horns: "bg-cyan-800/40 border-cyan-700/50",
      Ear: "bg-lime-800/40 border-lime-700/50",
      Snout: "bg-rose-800/40 border-rose-700/50",
    };

    return traitTypeColors[traitType] || "bg-gray-800 border-gray-700";
  };

  return (
    <div
      className={`rounded-lg border p-4 ${getBackgroundColor()} ${className}`}
    >
      <h3 className="mb-2 text-sm uppercase text-gray-400">{traitType}</h3>
      <div className="flex items-center justify-between">
        <div className="mb-1 break-words font-bold text-white">
          {isSpecialValue ? resolvedValue : resolvedValue}
        </div>
        {frequency && (
          <span className="ml-2 text-xs text-gray-400">{frequency}</span>
        )}
      </div>
    </div>
  );
};

export default AttributeBox;
