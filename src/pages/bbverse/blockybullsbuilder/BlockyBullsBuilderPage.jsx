import React, { useState, useEffect } from "react";
import { Download, RefreshCcwIcon } from "lucide-react";
import { Link } from "react-router-dom";
import attributes from "./data/attributes.json";
import ErrorDialog from "../../../components/ui/ErrorDialog";

// Updated to match the actual layering order with separate horn positions
const RENDER_ORDER = [
  "Background",
  "Fur",
  "Clothes",
  "Horn Right",
  "Eyes",
  "Head",
  "Ear",
  "Horn Left",
  "Snout",
];

// The attribute categories that users select from
const ATTRIBUTE_CATEGORIES = [
  "Background",
  "Fur",
  "Clothes",
  "Horns",
  "Eyes",
  "Head",
  "Ear",
  "Snout",
];

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="fixed inset-0 bg-black opacity-30"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-md rounded-lg bg-zinc-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default function BlockyBullsBuilderPage() {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [showAttributeDialog, setShowAttributeDialog] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState(null);
  const [existingNFT, setExistingNFT] = useState(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Move the checkerboard style to a constant so it can be reused
  const CHECKERBOARD_STYLE = {
    background: `
      linear-gradient(45deg, #666 25%, transparent 25%),
      linear-gradient(-45deg, #666 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #666 75%),
      linear-gradient(-45deg, transparent 75%, #666 75%)
    `,
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
    backgroundColor: "#999",
  };

  const handleRandomization = () => {
    const randomAttributes = {};
    ATTRIBUTE_CATEGORIES.forEach((attr) => {
      const options =
        attributes.attributeOptions[attr === "Horns" ? "Horns" : attr];
      randomAttributes[attr] =
        options[Math.floor(Math.random() * options.length)];
    });
    setSelectedAttributes(randomAttributes);
  };

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const loadAndDrawImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Important for CORS
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      // Draw each layer in order
      for (const layer of RENDER_ORDER) {
        if (!layer.includes("Horn")) {
          const value = selectedAttributes[layer];
          if (!value) continue;
          await loadAndDrawImage(getImagePathForLayer(layer, value));
        } else {
          const hornValue = selectedAttributes["Horns"];
          if (!hornValue) continue;
          await loadAndDrawImage(getImagePathForLayer(layer, hornValue));
        }
      }

      // Generate the filename
      const filename = existingNFT
        ? `blockybull_${existingNFT.id}.png`
        : `custom_blockybull_${Math.floor(Math.random() * 90000) + 10001}.png`;

      // Create a Blob from the canvas content
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setErrorMessage("Error creating image. Please try again.");
            setErrorDialogOpen(true);
            return;
          }

          // Create a Blob URL instead of a data URL
          const url = URL.createObjectURL(blob);

          // Create link for downloading the Blob
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;

          // Trigger download
          document.body.appendChild(link);
          link.click();

          // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(url); // Clean up Blob URL
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error generating image:", error);
      setErrorMessage(
        "Error generating image. Please try again or refresh the page."
      );
      setErrorDialogOpen(true);
    }
  };

  // Initialize with random attributes
  useEffect(() => {
    handleRandomization();
  }, []);

  // Check if current combination exists as an NFT
  useEffect(() => {
    if (
      Object.keys(selectedAttributes).length === ATTRIBUTE_CATEGORIES.length
    ) {
      const matchingNFT = attributes.items.find((item) =>
        ATTRIBUTE_CATEGORIES.every((attr) => {
          const optionsList =
            attributes.attributeOptions[attr === "Horns" ? "Horns" : attr];
          const value = selectedAttributes[attr];
          return (
            item.attributes[attr === "Horns" ? "Horns" : attr] ===
            optionsList.indexOf(value)
          );
        })
      );
      setExistingNFT(matchingNFT);
    }
  }, [selectedAttributes]);

  const handleAttributeClick = (attribute) => {
    setCurrentAttribute(attribute);
    setShowAttributeDialog(true);
  };

  const handleAttributeSelect = (value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [currentAttribute]: value,
    }));
    setShowAttributeDialog(false);
  };

  const getImagePathForLayer = (layer, value) => {
    // Special handling for horns
    if (layer === "Horn Left" || layer === "Horn Right") {
      const hornValue = selectedAttributes["Horns"];
      const position = layer === "Horn Left" ? "left" : "right";
      return `/bb/attributes/horns/${position}/images/${hornValue
        .toLowerCase()
        .replaceAll(" ", "_")}.png`;
    }

    // Normal handling for other attributes
    return `/bb/attributes/${layer.toLowerCase()}/images/${value
      .toLowerCase()
      .replaceAll(" ", "_")}.png`;
  };

  const AttributePreview = ({ attribute, value, size = "small" }) => {
    if (!value) return null;

    const sizeClasses = {
      small: "w-12 h-12",
      large: "w-24 h-24",
    };

    if (attribute === "Horns") {
      return (
        <div
          className={`relative ${sizeClasses[size]} overflow-hidden rounded`}
          style={CHECKERBOARD_STYLE}
        >
          <img
            src={`/bb/attributes/horns/left/images/${value
              .toLowerCase()
              .replaceAll(" ", "_")}.png`}
            alt={`${value} Left`}
            className="absolute inset-0 h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
          <img
            src={`/bb/attributes/horns/right/images/${value
              .toLowerCase()
              .replaceAll(" ", "_")}.png`}
            alt={`${value} Right`}
            className="absolute inset-0 h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} overflow-hidden rounded`}
        style={CHECKERBOARD_STYLE}
      >
        <img
          src={`/bb/attributes/${attribute.toLowerCase()}/images/${value
            .toLowerCase()
            .replaceAll(" ", "_")}.png`}
          alt={value}
          className="h-full w-full"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    );
  };

  return (
    <div className="mb-8 mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-4 text-4xl font-bold">BlockyBulls Builder</h1>
            <p className="mb-6 text-gray-500">
              Thousands of unique BlockyBulls were created,
              <br />
              but only a select few made it into the final 5,5k collection.
              <br />
              <br />
              Now, you have the chance to bring the forgotten ones to life!
              <br />
              Create your own unique BlockyBull by selecting different
              attributes.
            </p>

            <div className="flex flex-col gap-8 md:flex-row">
              {/* Preview Section */}
              <div className="md:w-1/2">
                <div className="mask mask-squircle relative aspect-square w-full rounded-lg bg-zinc-900">
                  <div className="absolute inset-0">
                    {/* Stack all layers in the correct order */}
                    {RENDER_ORDER.map((layer) => {
                      // For regular attributes
                      if (!layer.includes("Horn")) {
                        const value = selectedAttributes[layer];
                        if (!value) return null;
                        return (
                          <img
                            key={layer}
                            src={getImagePathForLayer(layer, value)}
                            alt={value}
                            className="absolute inset-0 h-full w-full"
                            style={{ imageRendering: "pixelated" }}
                          />
                        );
                      }

                      // For horns
                      const hornValue = selectedAttributes["Horns"];
                      if (!hornValue) return null;
                      return (
                        <img
                          key={layer}
                          src={getImagePathForLayer(layer, hornValue)}
                          alt={`${hornValue} ${layer}`}
                          className="absolute inset-0 h-full w-full"
                          style={{ imageRendering: "pixelated" }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4">
                  {/* Shape controls */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleRandomization}
                      className="btn btn-circle btn-ghost"
                    >
                      <RefreshCcwIcon size={24} />
                    </button>
                    <div className="divider divider-horizontal"></div>
                    <button
                      onClick={handleDownload}
                      className="btn btn-circle btn-ghost"
                    >
                      <Download size={24} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Attributes Section */}
              <div className="md:w-1/2">
                <div className="mb-4 flex items-start justify-between">
                  <h2 className="text-xl font-bold">Select Attributes</h2>
                </div>
                {existingNFT && (
                  <div className="mb-4 mt-4 rounded-lg border border-yellow-700 bg-yellow-900/50 p-4">
                    <h4 className="mb-1 font-bold">This BlockyBull exists!</h4>
                    <Link
                      to={`/collection/BlockyBulls/token/${
                        Number(existingNFT.id) - 1
                      }`}
                      className="flex items-center gap-2 text-blue-500 hover:font-bold"
                    >
                      <span className="hover:text-blue-400">
                        View BlockyBull #{existingNFT.id} here!
                      </span>
                    </Link>
                  </div>
                )}

                {!existingNFT && (
                  <div className="mb-4 mt-4  rounded-lg border border-blue-700 bg-blue-900/50 p-4">
                    <h4 className="mb-1 font-bold">Unique combination!</h4>
                    <p>
                      This combination does not exist as a BlockyBull NFT in
                      circulation
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {ATTRIBUTE_CATEGORIES.map((attr) => (
                    <div
                      key={attr}
                      onClick={() => handleAttributeClick(attr)}
                      className="group flex min-h-[88px] cursor-pointer rounded-lg bg-zinc-800 p-4 transition-colors hover:bg-zinc-700"
                    >
                      <div className="flex w-full items-center gap-3">
                        <div className="flex-shrink-0 rounded bg-zinc-900 p-1 group-hover:ring-1 group-hover:ring-blue-500">
                          <AttributePreview
                            attribute={attr}
                            value={selectedAttributes[attr]}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 text-sm uppercase text-gray-400">
                            {attr}
                          </h3>
                          <div className="overflow-hidden text-ellipsis font-bold text-white">
                            {/* Combined content into a single element */}
                            <span>{selectedAttributes[attr]}</span>
                            {attributes.attributeFrequencies &&
                              attributes.attributeFrequencies[attr] && (
                                <span className="text-sm text-gray-400">
                                  {
                                    attributes.attributeFrequencies[attr][
                                      selectedAttributes[attr]
                                    ]
                                  }
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Selection Modal */}
      <Modal
        isOpen={showAttributeDialog}
        onClose={() => setShowAttributeDialog(false)}
        title={`Select ${currentAttribute}`}
      >
        <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto p-1">
          {currentAttribute &&
            attributes.attributeOptions[
              currentAttribute === "Horns" ? "Horns" : currentAttribute
            ].map((value) => (
              <div
                key={value}
                onClick={() => handleAttributeSelect(value)}
                className="cursor-pointer rounded-lg border border-zinc-700 p-4 transition-colors hover:bg-zinc-700"
              >
                <div className="flex flex-col items-center">
                  <AttributePreview
                    attribute={currentAttribute}
                    value={value}
                    size="large"
                  />
                  <p className="mt-2 text-center text-white">{value}</p>
                  {attributes.attributeFrequencies &&
                    attributes.attributeFrequencies[currentAttribute] && (
                      <p className="text-center text-sm text-gray-400">
                        {
                          attributes.attributeFrequencies[currentAttribute][
                            value
                          ]
                        }
                      </p>
                    )}
                </div>
              </div>
            ))}
        </div>
      </Modal>
      {/* Error Dialog */}
      <ErrorDialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Download Error"
        message={errorMessage}
      />
    </div>
  );
}
