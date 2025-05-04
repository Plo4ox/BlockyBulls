import React from "react";

const AttributeFilter = ({
  attributeOptions,
  selectedAttributes,
  onAttributeChange,
  attributeFrequency,
}) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(attributeOptions).map(([attr, options]) => (
          <div key={attr}>
            <h3 className="mb-2 font-semibold">{attr}</h3>
            <select
              className="w-full rounded border bg-gray-800 p-2 text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onChange={(e) => onAttributeChange(attr, e.target.value)}
              value={selectedAttributes[attr] || ""}
            >
              <option value="">Any</option>
              {options.map((option, index) => (
                <option key={index} value={option}>
                  {option}{" "}
                  {attributeFrequency[attr] &&
                    attributeFrequency[attr][option] &&
                    `(${attributeFrequency[attr][option].count})`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeFilter;
