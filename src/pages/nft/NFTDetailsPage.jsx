import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useReadContract,
  useActiveAccount,
  TransactionButton,
} from "thirdweb/react";
import { resolveAddressToName } from "../../lib/utils/nameResolver";
import { download } from "thirdweb/storage";
import { getContractMetadata } from "thirdweb/extensions/common";
import { prepareContractCall } from "thirdweb";
import client from "../../lib/client";
import rarityData from "./data/rarityData.json";
import { useToast } from "../../hooks/use-toast";
import ErrorDialog from "../../components/ui/ErrorDialog";
import {
  blockyBullsContract,
  basedSnoutContract,
  btbContract,
  honoraryContract,
  marketplaceV3Contract,
} from "../../consts/contracts";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";
import attributeFrequencies from "./data/attribute_frequencies.json";
import { useMarketplace } from "../../contexts/MarketplaceContext";
import { ethers } from "ethers";
import { Square, Circle, Download } from "lucide-react";
import ApprovalDialog from "../../components/marketplace/ApprovalDialog";
import CreateListingPopup from "../../components/marketplace/CreateListingPopup";
import FormattedAddressLink from "../../components/ui/FormattedAddressLink";
import OptimizedImage from "../../components/ui/OptimizedImage";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex flex-col md:flex-row">
        <div className="mb-4 md:mb-0 md:mr-4 md:w-1/2">
          <div className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="md:w-1/2">
          <div className="mb-2 h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2 mt-4 h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-200 p-4 dark:bg-gray-700"
              >
                <div className="mb-2 h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttributeBox = ({ traitType, value }) => {
  const [resolvedValue, setResolvedValue] = useState(value);
  const frequency = attributeFrequencies[traitType]?.[value];

  useEffect(() => {
    const resolveAddressIfNeeded = async () => {
      if (value && value.startsWith("0x") && value.length === 42) {
        const resolvedName = await resolveAddressToName(client, value);
        setResolvedValue(
          <FormattedAddressLink
            address={value}
            name={resolvedName}
            useAccountPage={true}
          />
        );
      }
    };

    resolveAddressIfNeeded();
  }, [value]);

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h3 className="mb-2 text-sm uppercase text-gray-400">{traitType}</h3>
      <p className="mb-1 break-words font-bold text-white">
        {resolvedValue}{" "}
        {frequency && (
          <span className="text-sm text-gray-400">{frequency}</span>
        )}
      </p>
    </div>
  );
};

const HexagonIcon = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2 L21.4641 7 L21.4641 17 L12 22 L2.5359 17 L2.5359 7 Z" />
  </svg>
);

const shapes = {
  square: {
    containerClasses: "mask mask-squircle",
    icon: Square,
  },
  circle: {
    containerClasses: "mask mask-circle",
    icon: Circle,
  },
  hexagon: {
    containerClasses: "mask mask-hexagon",
    icon: HexagonIcon,
  },
};

const ShapeButton = ({ shape, currentShape, onClick }) => {
  const Icon = shapes[shape].icon;
  return (
    <button
      onClick={() => onClick(shape)}
      className={`btn btn-circle ${
        currentShape === shape
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "btn-ghost"
      }`}
    >
      <Icon size={24} />
    </button>
  );
};

const NFTImage = ({ metadata, currentShape, collection, id }) => {
  const { containerClasses } = shapes[currentShape];

  // Use the updated image handling approach
  const imageUrl = (() => {
    // Handle BasedSnout SVGs
    if (
      collection === "BasedSnout" &&
      metadata.image &&
      metadata.image.startsWith("data:image/svg+xml;base64,")
    ) {
      return metadata.image;
    }

    // Use the utility function for other collections
    return getNFTImageUrl(collection.toLowerCase(), id, { size: "large" });
  })();

  return (
    <div className={`relative aspect-square w-full ${containerClasses}`}>
      <OptimizedImage
        src={imageUrl}
        alt={metadata.name || `${collection} #${id}`}
        className="h-full w-full"
        shape={currentShape}
      />
    </div>
  );
};

export default function NFTDetailsPage() {
  const { collection, id } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [ownerName, setOwnerName] = useState(null);
  const [contractName, setContractName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rarity, setRarity] = useState(null);
  const activeAccount = useActiveAccount();
  const { createListing, buyListing, cancelListing, listings } =
    useMarketplace();
  const [currentListing, setCurrentListing] = useState(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isListingPopupOpen, setIsListingPopupOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const [currentShape, setCurrentShape] = useState("square");
  const imageRef = useRef(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const handleShapeChange = (shape) => {
    setCurrentShape(shape);
  };

  const handleDownload = async () => {
    if (!metadata || !metadata.image) return;

    try {
      const canvas = document.createElement("canvas");
      let imageUrl = metadata.image;
      const fileName = `${collection}_${id}.png`;

      // Handle BasedSnout SVG specifically
      if (
        collection === "BasedSnout" &&
        imageUrl.startsWith("data:image/svg+xml;base64,")
      ) {
        const base64Data = imageUrl.split(",")[1];
        const svgString = atob(base64Data);
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });

        const img = new Image();
        const objUrl = URL.createObjectURL(svgBlob);

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = objUrl;
        });

        // Set canvas size and draw image
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(objUrl); // Clean up object URL
      } else {
        // Get image URL based on collection
        let urlToUse;
        if (
          ["BlockyBulls", "BeyondTheBlock", "Honorary"].includes(collection)
        ) {
          urlToUse = getNFTImageUrl(collection.toLowerCase(), id, {
            size: "large",
          });
          if (
            typeof urlToUse === "object" &&
            urlToUse.background &&
            urlToUse.character
          ) {
            // For composite images with background and character
            const bgImg = await loadImageAsync(urlToUse.background);
            const charImg = await loadImageAsync(urlToUse.character);

            // Set canvas size
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext("2d");

            // Draw background and character
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(charImg, 0, 0, canvas.width, canvas.height);
          } else {
            // For single image
            const img = await loadImageAsync(urlToUse);
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        } else {
          // Handle other collections or IPFS URLs
          if (imageUrl.startsWith("ipfs://")) {
            imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
          }

          const img = new Image();
          img.crossOrigin = "anonymous"; // Important for CORS

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });

          // Set canvas size and draw image
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
        }
      }

      // Create a Blob from the canvas content
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Canvas is empty or could not create blob.");
        }

        const url = URL.createObjectURL(blob);

        // Create link to download the blob
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up blob URL
      }, "image/png");
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage(
        "Unable to download image. Please try opening in a regular browser or taking a screenshot."
      );
      setErrorDialogOpen(true);
    }
  };

  // Helper function to load an image asynchronously
  const loadImageAsync = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  const getContractForCollection = (collectionName) => {
    switch (collectionName) {
      case "BlockyBulls":
        return blockyBullsContract;
      case "BasedSnout":
        return basedSnoutContract;
      case "BeyondTheBlock":
        return btbContract;
      case "Honorary":
        return honoraryContract;
      default:
        return blockyBullsContract;
    }
  };

  const contract = getContractForCollection(collection);

  const { data: isApproved } = useReadContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: activeAccount
      ? [activeAccount.address, marketplaceV3Contract.address]
      : [],
  });

  useEffect(() => {
    const listing = listings.find(
      (l) => l.assetContract === contract.address && l.tokenId === id
    );
    setCurrentListing(listing);
  }, [listings, contract.address, id]);

  const handleApprove = (
    onTransactionSent,
    onTransactionConfirmed,
    onError
  ) => ({
    transaction: () => {
      return prepareContractCall({
        contract: contract,
        method: "function setApprovalForAll(address operator, bool approved)",
        params: [marketplaceV3Contract.address, true],
      });
    },
    onTransactionSent: (result) => {
      onTransactionSent(result);
      toast({
        title: "Approval Initiated",
        description: "Your approval transaction has been sent.",
      });
    },
    onTransactionConfirmed: (receipt) => {
      onTransactionConfirmed(receipt);
      toast({
        title: "Approval Confirmed",
        description: "Your NFT has been approved for the marketplace.",
      });
    },
    onError: (error) => {
      onError(error);
      toast({
        title: "Approval Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateListing = (
    priceInWei,
    endTimestamp,
    onTransactionSent,
    onTransactionConfirmed,
    onError
  ) => ({
    transaction: () => {
      return createListing(
        contract.address,
        id,
        "1",
        priceInWei,
        endTimestamp
      )().transaction();
    },
    onTransactionSent,
    onTransactionConfirmed: (receipt) => {
      onTransactionConfirmed(receipt);
      setIsListingPopupOpen(false);
    },
    onError,
  });

  const { data: tokenURI } = useReadContract({
    contract,
    method: "function tokenURI(uint256 _tokenId) view returns (string)",
    params: [id],
  });

  const { data: owner } = useReadContract({
    contract,
    method: "function ownerOf(uint256 tokenId) view returns (address)",
    params: [id],
  });

  useEffect(() => {
    const fetchContractMetadata = async () => {
      try {
        const contractMetadata = await getContractMetadata({ contract });
        setContractName(contractMetadata.name);
      } catch (error) {
        console.error("Error fetching contract metadata:", error);
        setContractName(collection);
      }
    };

    fetchContractMetadata();
  }, [contract, collection]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          if (collection === "BlockyBulls") {
            setRarity(
              rarityData.find((element) => element.token_id == Number(id) + 1)
            );
          }

          let jsonMetadata;
          if (tokenURI.startsWith("ipfs://")) {
            const file = await download({
              client,
              uri: tokenURI,
            });
            jsonMetadata = JSON.parse(await file.text());
          } else if (tokenURI.startsWith("data:application/json;base64,")) {
            const base64Data = tokenURI.split(",")[1];
            jsonMetadata = JSON.parse(atob(base64Data));
          } else {
            const response = await fetch(tokenURI);
            jsonMetadata = await response.json();
          }

          setMetadata(jsonMetadata);
        } catch (err) {
          console.error("Error fetching metadata:", err);
          setError("Failed to fetch NFT metadata");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMetadata();
  }, [tokenURI, collection, id]);

  useEffect(() => {
    const resolveOwnerName = async () => {
      if (owner) {
        setOwnerName(await resolveAddressToName(client, owner));
      }
    };

    resolveOwnerName();
  }, [owner]);

  if (isLoading) {
    return (
      <div className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <SkeletonLoader />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderShapeControls = () => {
    if (["BlockyBulls", "BeyondTheBlock", "Honorary"].includes(collection)) {
      return (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex space-x-2">
            {Object.keys(shapes).map((shape) => (
              <ShapeButton
                key={shape}
                shape={shape}
                currentShape={currentShape}
                onClick={handleShapeChange}
              />
            ))}
          </div>
          <div className="divider divider-horizontal"></div>
          <button onClick={handleDownload} className="btn btn-circle btn-ghost">
            <Download size={24} />
          </button>
        </div>
      );
    }
    return (
      <div className="mt-4 flex justify-center">
        <button onClick={handleDownload} className="btn btn-circle btn-ghost">
          <Download size={24} />
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <div>Unable to load the NFT Data</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <div>NFT not found</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="text-4xl font-bold">{contractName}</h1>
            <p className="mb-6 text-gray-500">{contract.address}</p>
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="relative md:w-1/2">
                <div className="mx-auto max-w-[512px]">
                  <NFTImage
                    metadata={metadata}
                    currentShape={currentShape}
                    collection={collection}
                    id={id}
                  />
                </div>
                {renderShapeControls()}
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold">
                  {id}_{metadata.name}
                </h2>
                {metadata.description && (
                  <p className="mb-6 mt-2 text-gray-500">
                    {metadata.description}
                  </p>
                )}
                <p className="mt-2">
                  Owned by{" "}
                  <span className="text-blue-400">
                    <FormattedAddressLink
                      address={owner}
                      name={ownerName}
                      useAccountPage={false}
                    />
                  </span>
                </p>
                {currentListing && (
                  <div className="mt-2">
                    <p>
                      Currently on sale for{" "}
                      <span className="font-bold">
                        {ethers.utils.formatEther(currentListing.pricePerToken)}
                        Ξ
                      </span>
                    </p>
                    <p>
                      Listing ends on {formatDate(currentListing.endTimestamp)}
                    </p>
                  </div>
                )}
                <div className="mb-6 mt-4">
                  {!currentListing && (
                    <p className="mb-6">
                      This item is not currently listed for sale.
                    </p>
                  )}
                  {activeAccount && activeAccount.address === owner ? (
                    currentListing ? (
                      <TransactionButton
                        {...cancelListing(currentListing.id)()}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      >
                        Cancel Listing
                      </TransactionButton>
                    ) : (
                      <div>
                        {!isApproved ? (
                          <button
                            onClick={() => setIsApprovalDialogOpen(true)}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          >
                            Approve the collection for listing
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsListingPopupOpen(true)}
                            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                          >
                            Create Listing
                          </button>
                        )}
                      </div>
                    )
                  ) : (
                    currentListing &&
                    activeAccount && (
                      <div>
                        <TransactionButton
                          {...buyListing(
                            currentListing.id,
                            1,
                            currentListing.pricePerToken
                          )()}
                          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                        >
                          Buy Now for{" "}
                          {ethers.utils.formatEther(
                            currentListing.pricePerToken
                          )}{" "}
                          ETH
                        </TransactionButton>
                      </div>
                    )
                  )}

                  <ApprovalDialog
                    isOpen={isApprovalDialogOpen}
                    onClose={() => setIsApprovalDialogOpen(false)}
                    handleApprove={handleApprove}
                    marketplaceAddress={marketplaceV3Contract.address}
                  />

                  <CreateListingPopup
                    isOpen={isListingPopupOpen}
                    onClose={() => setIsListingPopupOpen(false)}
                    handleCreateListing={handleCreateListing}
                  />
                </div>
                {rarity && (
                  <div className="mb-4 rounded-lg bg-gray-800 p-4">
                    <h3 className="text-sm uppercase text-gray-400">
                      Rarity rank -{" "}
                      <span className="break-words text-white">
                        <span className="font-bold">{rarity.rank}</span> / 5500
                      </span>
                    </h3>
                  </div>
                )}

                {metadata.attributes && (
                  <div className="grid grid-cols-2 gap-4">
                    {metadata.attributes.map((attr, index) => (
                      <AttributeBox
                        key={index}
                        traitType={attr.trait_type}
                        value={attr.value}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorDialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Download Error"
        message={errorMessage}
      />
    </div>
  );
}
