import React, { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { ethers } from "ethers";
import OptimizedImage from "../ui/OptimizedImage";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";

const formatEthPrice = (price) => {
  if (price === undefined || price == null) return "N/A";
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + "M";
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + "K";
  } else {
    return price;
  }
};

const formatUSDPrice = (price) => {
  if (price === undefined || price == null) return "N/A";
  if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + "M";
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + "K";
  } else {
    return price.toFixed(2);
  }
};

const SaleCard = React.memo(
  ({ nft, listing, ethPrice, onClick, collection }) => {
    const ethValue = listing
      ? parseFloat(ethers.utils.formatEther(listing.pricePerToken))
      : null;
    const usdValue =
      ethValue && ethPrice ? parseFloat(ethValue) * ethPrice : null;

    return (
      <div
        className="w-64 cursor-pointer transition-opacity duration-200 hover:opacity-80"
        onClick={() => onClick(nft.id)}
      >
        <div className="relative">
          <OptimizedImage
            src={getNFTImageUrl(collection, Number(nft.id) - 1, {
              size: "medium",
            })}
            alt={`${collection} #${nft.id}`}
            className="h-32 w-32"
            shape="square"
          />
          <div className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg border-b-2 border-r-2 border-dashed bg-blue-500 px-2 py-1 text-white">
            #{nft.id}
          </div>
        </div>
        <div className="mt-2">
          <p className="text-lg font-bold">
            {formatEthPrice(ethValue)}Ξ
            {
              <span className="text-xs text-gray-500">
                (${formatUSDPrice(usdValue)})
              </span>
            }
          </p>
          {nft.rarity && (
            <p className="text-sm text-gray-500">Rank: {nft.rarity}</p>
          )}
        </div>
      </div>
    );
  }
);

const VirtualizedSaleGrid = ({
  nfts,
  listings,
  ethPrice,
  onNFTClick,
  collection,
}) => {
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const gridRef = useRef(null);
  const listings_ = [...listings]
    .sort((a, b) => Number(a.pricePerToken) - Number(b.pricePerToken))
    .filter((listing) => {
      return nfts.some((nft) => Number(listing.tokenId) === Number(nft.id) - 1);
    });

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

  const ITEM_WIDTH = 160;
  const ITEM_HEIGHT = 200;
  const COLUMN_COUNT = Math.floor(gridDimensions.width / ITEM_WIDTH) || 1;
  const gridWidth = COLUMN_COUNT * ITEM_WIDTH;

  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * COLUMN_COUNT + columnIndex;
      if (index >= nfts.length) return null;

      const listing = listings_[index];
      const nft = nfts.find(
        (item) =>
          Number(listing.tokenId) ===
          (collection == "blockybulls" ? Number(item.id) - 1 : Number(item.id))
      );

      return (
        <div style={style}>
          <SaleCard
            nft={nft}
            listing={listing}
            ethPrice={ethPrice}
            onClick={onNFTClick}
            collection={collection}
          />
        </div>
      );
    },
    [nfts, listings_, ethPrice, onNFTClick, COLUMN_COUNT, collection]
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
            columnWidth={ITEM_WIDTH}
            height={gridDimensions.height}
            rowCount={Math.ceil(nfts.length / COLUMN_COUNT)}
            rowHeight={ITEM_HEIGHT}
            width={gridWidth}
          >
            {Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default VirtualizedSaleGrid;
