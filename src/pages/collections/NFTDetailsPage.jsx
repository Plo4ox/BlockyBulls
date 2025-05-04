// src/pages/collections/NFTDetailsPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useReadContract,
  useActiveAccount,
  TransactionButton,
} from "thirdweb/react";
import { resolveAddressToName } from "../../lib/utils/nameResolver";
import { download } from "thirdweb/storage";
import { prepareContractCall } from "thirdweb";
import client from "../../lib/client";
import { ethers } from "ethers";
import { useToast } from "../../components/ui/use-toast";
import {
  getNFTImageUrl,
  getBackgroundForNFT,
} from "../../lib/utils/imageUtils";
import { getContractForCollection } from "../../consts/contracts";
import { marketplaceV3Contract } from "../../consts/contracts";
import { useMarketplace } from "../../contexts/MarketplaceContext";
import AttributeBox from "../../components/nft/AttributeBox";
import OptimizedImage from "../../components/ui/OptimizedImage";
import FormattedAddressLink from "../../components/ui/FormattedAddressLink";
import ShapeSelector from "../../components/ui/ShapeSelector";
import ErrorDialog from "../../components/ui/ErrorDialog";
import CreateListingPopup from "../../components/marketplace/CreateListingPopup";
import ApprovalDialog from "../../components/marketplace/ApprovalDialog";

// Component to display while loading NFT data
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

export default function NFTDetailsPage() {
  const { collection, id } = useParams();
  const navigate = useNavigate();
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
  const [currentBackground, setCurrentBackground] = useState("base");

  // Get the appropriate contract based on the collection
  const contract = getContractForCollection(collection);

  // Check if the NFT is approved for the marketplace
  const { data: isApproved } = useReadContract({
    contract,
    method:
      "function isApprovedForAll(address owner, address operator) view returns (bool)",
    params: activeAccount
      ? [activeAccount.address, marketplaceV3Contract.address]
      : [],
  });

  // Get the current listing for this NFT if it exists
  useEffect(() => {
    const listing = listings.find(
      (l) => l.assetContract === contract.address && l.tokenId === id
    );
    setCurrentListing(listing);
  }, [listings, contract.address, id]);

  // Format a timestamp as a readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Handle changing the display shape of the NFT
  const handleShapeChange = (shape) => {
    setCurrentShape(shape);
  };

  // Handle changing the background of the NFT
  const handleBackgroundChange = (bg) => {
    setCurrentBackground(bg);
  };

  // Handle downloading the NFT image
  const handleDownload = async () => {
    try {
      const imageUrl = getNFTImageUrl(collection, id, {
        background: currentBackground,
        size: "large",
      });

      // For composite images (background + character)
      if (
        typeof imageUrl === "object" &&
        imageUrl.background &&
        imageUrl.character
      ) {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");

        // Load and draw both images
        const bgImg = await loadImageAsync(imageUrl.background);
        const charImg = await loadImageAsync(imageUrl.character);

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(charImg, 0, 0, canvas.width, canvas.height);

        // Convert to blob and download
        downloadFromCanvas(canvas, `${collection}_${id}.png`);
      } else {
        // Direct download for single image
        const img = await loadImageAsync(imageUrl);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        downloadFromCanvas(canvas, `${collection}_${id}.png`);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setErrorMessage(
        "Unable to download image. Please try again or take a screenshot."
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

  // Helper function to download from a canvas
  const downloadFromCanvas = (canvas, fileName) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        setErrorMessage("Failed to create image data. Please try again.");
        setErrorDialogOpen(true);
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  // Handle approving the NFT for marketplace listings
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
        status: "info",
      });
    },
    onTransactionConfirmed: (receipt) => {
      onTransactionConfirmed(receipt);
      toast({
        title: "Approval Confirmed",
        description: "Your NFT has been approved for the marketplace.",
        status: "success",
      });
    },
    onError: (error) => {
      onError(error);
      toast({
        title: "Approval Failed",
        description: `Error: ${error.message}`,
        status: "error",
      });
    },
  });

  // Handle creating a marketplace listing
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

  // Get token URI from the contract
  const { data: tokenURI } = useReadContract({
    contract,
    method: "function tokenURI(uint256 _tokenId) view returns (string)",
    params: [id],
  });

  // Get the owner of the NFT
  const { data: owner } = useReadContract({
    contract,
    method: "function ownerOf(uint256 tokenId) view returns (address)",
    params: [id],
  });

  // Fetch contract metadata
  useEffect(() => {
    const fetchContractMetadata = async () => {
      try {
        const { name } = await contract.read.contractURI();
        setContractName(name || collection);
      } catch (error) {
        console.error("Error fetching contract metadata:", error);
        setContractName(collection);
      }
    };

    fetchContractMetadata();
  }, [contract, collection]);

  // Fetch NFT metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI) {
        try {
          // For BlockyBulls, we might have rarity data
          if (collection.toLowerCase() === "blockybulls") {
            try {
              const rarityResponse = await fetch(
                `/api/rarity/${Number(id) + 1}`
              );
              if (rarityResponse.ok) {
                const rarityData = await rarityResponse.json();
                setRarity(rarityData);
              }
            } catch (err) {
              console.error("Error fetching rarity data:", err);
            }
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

  // Resolve owner address to ENS or other human-readable name
  useEffect(() => {
    const resolveOwnerName = async () => {
      if (owner) {
        setOwnerName(await resolveAddressToName(client, owner));
      }
    };

    resolveOwnerName();
  }, [owner]);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="mb-8 mt-16 sm:px-8">
        <div className="mx-auto w-full max-w-7xl lg:px-8">
          <div className="relative px-4 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-2xl lg:max-w-5xl">
              <div className="rounded-lg bg-red-500 bg-opacity-20 p-4">
                <h2 className="mb-2 text-xl font-bold">Error</h2>
                <p>{error || "Unable to load the NFT Data"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No metadata state
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

  // Get image URL for the NFT
  const imageUrl = getNFTImageUrl(collection, id, {
    background: currentBackground,
    size: "large",
  });

  // Main render
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
                  <OptimizedImage
                    src={imageUrl}
                    alt={`${collection} #${id}`}
                    className="aspect-square w-full"
                    shape={currentShape}
                  />
                </div>

                {/* Shape and background controls */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-500">Shape:</span>
                    <ShapeSelector
                      currentShape={currentShape}
                      onChange={handleShapeChange}
                    />
                  </div>

                  {collection.toLowerCase() === "blockybulls" && (
                    <div className="ml-4 flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        Background:
                      </span>
                      <select
                        value={currentBackground}
                        onChange={(e) => handleBackgroundChange(e.target.value)}
                        className="rounded bg-gray-700 px-2 py-1 text-sm text-white"
                      >
                        <option value="base">Base</option>
                        <option value="custom">Custom</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  )}

                  <button
                    onClick={handleDownload}
                    className="ml-4 rounded-lg bg-blue-500 p-2 text-sm text-white hover:bg-blue-600"
                    title="Download Image"
                  >
                    Download
                  </button>
                </div>
              </div>

              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold">
                  {metadata.name || `#${id}`}
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

                {/* Display listing information if for sale */}
                {currentListing && (
                  <div className="mt-2 rounded-lg border border-green-900/40 bg-green-900/20 p-4">
                    <p className="text-lg font-bold">
                      Currently on sale for{" "}
                      {ethers.utils.formatEther(currentListing.pricePerToken)}Ξ
                    </p>
                    <p className="text-sm text-gray-400">
                      Listing ends on {formatDate(currentListing.endTimestamp)}
                    </p>
                  </div>
                )}

                {/* Marketplace action buttons */}
                <div className="mb-6 mt-6">
                  {!currentListing && (
                    <p className="mb-2 text-sm text-gray-500">
                      This item is not currently listed for sale.
                    </p>
                  )}

                  {activeAccount && activeAccount.address === owner ? (
                    // Owner actions
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
                      // Buyer actions
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
                </div>

                {/* Rarity information */}
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

                {/* Attributes */}
                {metadata.attributes && metadata.attributes.length > 0 && (
                  <>
                    <h3 className="mb-4 text-xl font-semibold">Attributes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {metadata.attributes.map((attr, index) => (
                        <AttributeBox
                          key={index}
                          traitType={attr.trait_type}
                          value={attr.value}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
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

      <ErrorDialog
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="Download Error"
        message={errorMessage}
      />
    </div>
  );
}
