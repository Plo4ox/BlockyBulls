// src/pages/home/ForSaleSection.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMarketplace } from "../../contexts/MarketplaceContext";
import { ethers } from "ethers";
import { BlockyBullsContractAddress } from "../../consts/contracts";
import OptimizedImage from "../../components/ui/OptimizedImage";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";
import useEthPrice from "../../hooks/useEthPrice";

/**
 * Component to display NFTs currently for sale
 */
const ForSaleSection = () => {
  const { listings } = useMarketplace();
  const [lowestPrice, setLowestPrice] = useState(null);
  const [forSaleListings, setForSaleListings] = useState([]);
  const { ethPrice, loading: ethPriceLoading } = useEthPrice();

  // Extract BlockyBulls listings and sort by price
  const blockyBullsListings = useMemo(() => {
    return listings
      .filter((listing) => listing.assetContract === BlockyBullsContractAddress)
      .sort((a, b) => Number(a.pricePerToken) - Number(b.pricePerToken));
  }, [listings]);

  // Update listings to show (up to 25)
  useEffect(() => {
    setForSaleListings(blockyBullsListings.slice(0, 25));

    // Get the lowest price listing
    if (blockyBullsListings.length > 0) {
      setLowestPrice(blockyBullsListings[0]);
    }
  }, [blockyBullsListings]);

  // Format price displays
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

  const formatPrice = (price) => {
    const ethValue = ethers.utils.formatEther(price);
    const usdValue = ethPrice
      ? formatUSDPrice(parseFloat(ethValue) * ethPrice)
      : "N/A";
    return `${formatEthPrice(parseFloat(ethValue))} ETH ($${usdValue})`;
  };

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-3xl font-bold">For Sale</h2>
      {forSaleListings.length > 0 ? (
        <>
          <p className="mb-2">
            There are currently {forSaleListings.length} BlockyBulls for sale.
            <br />
            <Link
              to="/collection/BlockyBulls/explorer?tab=onSale"
              className="text-blue-500 hover:underline"
            >
              View all BlockyBulls for sale
            </Link>
          </p>
          {lowestPrice && (
            <p className="mb-4 text-base text-zinc-600 dark:text-zinc-400">
              The lowest price BlockyBull currently for sale is at{" "}
              <span className="font-bold">
                {formatPrice(lowestPrice.pricePerToken)}
              </span>
              .
            </p>
          )}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {forSaleListings.map((listing) => (
                <Link
                  to={`/collection/BlockyBulls/token/${listing.tokenId}`}
                  key={listing.id}
                >
                  <div className="relative h-16 w-16 transform rounded-lg transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md active:scale-95">
                    <OptimizedImage
                      src={getNFTImageUrl(
                        "blockybulls",
                        Number(listing.tokenId),
                        { size: "small" }
                      )}
                      alt={`BlockyBull #${listing.tokenId}`}
                      className="h-full w-full"
                      shape="squircle"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="mb-2">
            There are currently no BlockyBulls for sale on this marketplace.
            <br />
            <Link
              to="/collection/BlockyBulls/attributes"
              className="text-blue-500 hover:underline"
            >
              Explore BlockyBulls collection
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForSaleSection;
