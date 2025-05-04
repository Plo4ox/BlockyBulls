// src/components/nft/NFTGrid.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import NFTCard from "./NFTCard";

const NFTGrid = ({
  nfts = [],
  collection,
  onNFTClick,
  listings = [],
  ethPrice,
  variant = "regular",
  shape = "square",
  showPriceInfo = false,
  background = "base",
  usePagination = false,
  itemsPerPage = 20,
  customRowRenderer,
}) => {
  const [gridDimensions, setGridDimensions] = useState({ width: 0, height: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef(null);

  // Calculate item dimensions based on variant
  const getItemDimensions = () => {
    switch (variant) {
      case "compact":
        return { width: 100, height: 120 };
      case "sale":
        return { width: 180, height: 220 };
      default:
        return { width: 160, height: 200 };
    }
  };

  const { width: ITEM_WIDTH, height: ITEM_HEIGHT } = getItemDimensions();

  // Update grid dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        const { width } = gridRef.current.getBoundingClientRect();
        const height = Math.max(
          400,
          window.innerHeight - gridRef.current.offsetTop - 40
        );
        setGridDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Calculate grid columns based on container width
  const COLUMN_COUNT = Math.max(
    1,
    Math.floor(gridDimensions.width / ITEM_WIDTH)
  );

  // Handle pagination
  const paginatedNFTs = usePagination
    ? nfts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : nfts;

  const totalPages = Math.ceil(nfts.length / itemsPerPage);

  // Map NFTs to their associated listings
  const getNFTListing = useCallback(
    (nftId) => {
      const adjustedId =
        collection.toLowerCase() === "blockybulls"
          ? Number(nftId) - 1
          : Number(nftId);
      return listings.find((listing) => Number(listing.tokenId) === adjustedId);
    },
    [listings, collection]
  );

  // Cell renderer for virtualized grid
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * COLUMN_COUNT + columnIndex;
      if (index >= nfts.length) return null;

      const nft = nfts[index];
      const listing = getNFTListing(nft.id);

      return (
        <div style={style} className="p-2">
          <NFTCard
            nft={nft}
            collection={collection}
            onClick={onNFTClick}
            listing={listing}
            ethPrice={ethPrice}
            variant={variant}
            shape={shape}
            showPriceInfo={showPriceInfo}
            background={background}
          />
        </div>
      );
    },
    [
      nfts,
      collection,
      onNFTClick,
      listings,
      ethPrice,
      COLUMN_COUNT,
      variant,
      shape,
      showPriceInfo,
      background,
      getNFTListing,
    ]
  );

  // When using pagination instead of virtualization
  if (usePagination) {
    return (
      <div ref={gridRef} className="w-full">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {paginatedNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              collection={collection}
              onClick={onNFTClick}
              listing={getNFTListing(nft.id)}
              ethPrice={ethPrice}
              variant={variant}
              shape={shape}
              showPriceInfo={showPriceInfo}
              background={background}
            />
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav>
              <ul className="flex h-8 items-center -space-x-px text-sm">
                <li>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="ml-0 flex h-8 items-center justify-center rounded-l-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-2.5 w-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                  </button>
                </li>

                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  // Show pages around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = currentPage - 2 + idx;
                  }

                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <li key={pageNum}>
                        <button
                          onClick={() => setCurrentPage(pageNum)}
                          className={`flex h-8 items-center justify-center px-3 leading-tight ${
                            currentPage === pageNum
                              ? "border border-blue-300 bg-blue-50 text-blue-600 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                              : "border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}

                <li>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-8 items-center justify-center rounded-r-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-2.5 w-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Virtualized grid for performance with large collections
  return (
    <div ref={gridRef} className="min-h-[400px] w-full">
      {gridDimensions.width > 0 && (
        <div className="flex w-full justify-center">
          <Grid
            columnCount={COLUMN_COUNT}
            columnWidth={ITEM_WIDTH}
            height={gridDimensions.height}
            rowCount={Math.ceil(nfts.length / COLUMN_COUNT)}
            rowHeight={ITEM_HEIGHT}
            width={Math.min(gridDimensions.width, COLUMN_COUNT * ITEM_WIDTH)}
          >
            {customRowRenderer || Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};
