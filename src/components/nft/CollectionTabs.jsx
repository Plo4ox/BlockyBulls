import React from "react";

const CollectionTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="mb-4 flex border-b border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-2 font-semibold ${
            activeTab === tab.id
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-300"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CollectionTabs;
