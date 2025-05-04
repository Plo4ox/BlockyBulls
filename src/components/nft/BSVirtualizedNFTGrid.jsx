import React, { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { useReadContract } from "thirdweb/react";
import OptimizedImage from "../ui/OptimizedImage";

const NFTCard = React.memo(({ nft, onClick, imageUrl }) => {
  return (
    <div
      className="flex transform cursor-pointer flex-col items-center rounded-lg p-4 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
      onClick={() => onClick(Number(nft.id))}
    >
      <div className="relative aspect-square w-full rounded-lg border-2">
        <OptimizedImage
          src={`data:image/svg+xml;base64,${imageUrl}`}
          alt={`Based Snout #${Number(nft.id)}`}
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
      <div className="mt-2 w-full text-center">
        <p className="text-xs font-semibold">#{Number(nft.id)}</p>
      </div>
    </div>
  );
});

const BSVirtualizedNFTGrid = ({
  nfts,
  blockyBullsListings,
  ethPrice,
  onNFTClick,
  collection,
  contract,
  showPriceInfo,
  fromAccount,
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

  const WIDTH_SIZE = 120;
  const HEIGHT_SIZE = 140;
  const COLUMN_COUNT = Math.floor(gridDimensions.width / WIDTH_SIZE) || 1;
  const gridWidth = COLUMN_COUNT * WIDTH_SIZE;

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

      const { data: tokenURI } = useReadContract({
        contract,
        method: "function tokenURI(uint256 _tokenId) view returns (string)",
        params: [Number(nft.id)],
      });

      const [imageUrl, setImageUrl] = useState(null);

      useEffect(() => {
        if (collection === "BasedSnout" && tokenURI) {
          if (tokenURI.startsWith("data:application/json;base64,")) {
            const base64Data = tokenURI.split(",")[1];
            const jsonString = atob(base64Data);
            const metadata = JSON.parse(jsonString);
            if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
              setImageUrl(metadata.image.split(",")[1]);
            }
          }
        }
      }, [tokenURI, collection]);

      return (
        <div style={style}>
          <NFTCard
            nft={nft}
            onClick={onNFTClick}
            imageUrl={imageUrl}
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
      showPriceInfo,
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
            columnWidth={WIDTH_SIZE}
            height={gridDimensions.height}
            rowCount={Math.ceil(nfts.length / COLUMN_COUNT)}
            rowHeight={HEIGHT_SIZE}
            width={gridWidth}
          >
            {Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default BSVirtualizedNFTGrid;
