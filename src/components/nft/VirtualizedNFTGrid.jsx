import React, { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import OptimizedImage from "../ui/OptimizedImage";
import { ethers } from "ethers";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";

const NFTCard = React.memo(
  ({
    nft,
    onClick,
    collection,
    imageUrl,
    isForSale,
    listing,
    ethPrice,
    fromAccount,
  }) => {
    const ethValue = listing
      ? ethers.utils.formatEther(listing.pricePerToken)
      : null;
    const usdValue =
      ethValue && ethPrice
        ? (parseFloat(ethValue) * ethPrice).toFixed(2)
        : null;
    const nftId =
      collection == "blockybulls" ? Number(nft.id) - 1 : Number(nft.id);
    const nftNumber = Number(nft.id);

    return (
      <div
        className="flex transform cursor-pointer flex-col items-center rounded-lg p-2 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
        onClick={() => onClick(Number(nft.id))}
      >
        <div className="relative">
          {collection === "BasedSnout" && imageUrl ? (
            <img
              src={`data:image/svg+xml;base64,${imageUrl}`}
              alt={`Based Snout #${nft.id}`}
              className="mask mask-squircle h-16 w-16 object-cover"
            />
          ) : (
            <OptimizedImage
              src={getNFTImageUrl(collection, nftId, { size: "small" })}
              alt={`${collection} #${nftNumber}`}
              className="h-16 w-16"
              shape="squircle"
            />
          )}
        </div>
        <div className="mt-1 text-center">
          <p className="text-xs font-semibold">#{nftNumber}</p>
          {nft.rarity && (
            <p className="text-xs text-gray-500">Rank: {nft.rarity}</p>
          )}
        </div>
      </div>
    );
  }
);

const VirtualizedNFTGrid = ({
  nfts,
  blockyBullsListings,
  ethPrice,
  onNFTClick,
  collection,
  contract,
  showPriceInfo = false,
  fromAccount = false,
}) => {
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const gridRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        const { width } = gridRef.current.getBoundingClientRect();
        const height = Math.max(
          400,
          window.innerHeight - gridRef.current.offsetTop - 20
        );
        setGridDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const ITEM_SIZE = 120;
  const COLUMN_COUNT = Math.floor(gridDimensions.width / ITEM_SIZE) || 1;
  const gridWidth = COLUMN_COUNT * ITEM_SIZE;

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * COLUMN_COUNT + columnIndex;
      if (index >= nfts.length) return null;

      const nft = nfts[index];
      const isForSale = blockyBullsListings
        ? blockyBullsListings.some(
            (listing) => listing.tokenId === Number(nft.id)
          )
        : false;
      const listing = isForSale
        ? blockyBullsListings.find(
            (listing) => listing.tokenId === Number(nft.id)
          )
        : null;

      const [imageUrl, setImageUrl] = useState(null);

      useEffect(() => {
        if (collection === "BasedSnout" && contract) {
          const fetchTokenURI = async () => {
            try {
              const tokenURI = await contract.read.tokenURI([nft.id]);
              if (tokenURI.startsWith("data:application/json;base64,")) {
                const base64Data = tokenURI.split(",")[1];
                const jsonString = atob(base64Data);
                const metadata = JSON.parse(jsonString);
                if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
                  setImageUrl(metadata.image.split(",")[1]);
                }
              }
            } catch (error) {
              console.error("Error fetching token URI:", error);
            }
          };
          fetchTokenURI();
        }
      }, [nft.id, collection, contract]);

      return (
        <div style={style}>
          <NFTCard
            nft={nft}
            onClick={onNFTClick}
            collection={collection}
            imageUrl={imageUrl}
            isForSale={isForSale}
            listing={listing}
            ethPrice={ethPrice}
            fromAccount={fromAccount}
          />
        </div>
      );
    },
    [
      nfts,
      onNFTClick,
      COLUMN_COUNT,
      collection,
      contract,
      blockyBullsListings,
      ethPrice,
      fromAccount,
    ]
  );

  return (
    <div
      ref={gridRef}
      style={{ width: "100%", height: "100%", minHeight: "400px" }}
    >
      {gridDimensions.width > 0 && (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <Grid
            columnCount={COLUMN_COUNT}
            columnWidth={ITEM_SIZE}
            height={gridDimensions.height}
            rowCount={Math.ceil(nfts.length / COLUMN_COUNT)}
            rowHeight={ITEM_SIZE}
            width={gridWidth}
          >
            {Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default VirtualizedNFTGrid;
