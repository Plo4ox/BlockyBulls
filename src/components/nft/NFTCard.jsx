import React from "react";
import { ethers } from "ethers";
import OptimizedImage from "../common/OptimizedImage";
import { getNFTImageUrl } from "../../lib/utils/imageUtils";

const NFTCard = ({
  nft,
  collection,
  onClick,
  listing,
  ethPrice,
  variant = "regular",
  shape = "square",
  showPriceInfo = false,
  background = "base",
}) => {
  const nftId =
    collection.toLowerCase() === "blockybulls"
      ? Number(nft.id)
      : Number(nft.id) + 1;
  const imageUrl = getNFTImageUrl(collection, nftId, { shape, background });

  const isForSale = !!listing;
  const ethValue = isForSale
    ? parseFloat(ethers.utils.formatEther(listing.pricePerToken))
    : null;
  const usdValue =
    ethValue && ethPrice ? parseFloat(ethValue) * ethPrice : null;

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

  if (variant === "compact") {
    return (
      <div
        onClick={() => onClick(nft.id)}
        className="transform cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md active:scale-95"
      >
        <OptimizedImage
          src={imageUrl}
          alt={`${collection} #${nftId}`}
          className="h-16 w-16"
          shape="squircle"
        />
      </div>
    );
  }

  if (variant === "sale") {
    return (
      <div
        className="w-full cursor-pointer transition-opacity duration-200 hover:opacity-80"
        onClick={() => onClick(nft.id)}
      >
        <div className="relative">
          <OptimizedImage
            src={imageUrl}
            alt={`${collection} #${nftId}`}
            className="h-32 w-full sm:h-40"
            shape={shape}
          />
          <div className="absolute left-0 top-0 rounded-br-lg rounded-tl-lg border-b-2 border-r-2 border-dashed bg-blue-500 px-2 py-1 text-white">
            #{nftId}
          </div>
          {isForSale && (
            <div className="absolute bottom-0 right-0 rounded-tl-lg bg-green-500 px-2 py-1 text-white">
              {formatEthPrice(ethValue)}Ξ
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-lg font-bold">
            {isForSale ? `${formatEthPrice(ethValue)}Ξ` : `#${nftId}`}
            {isForSale && usdValue && (
              <span className="ml-1 text-xs text-gray-500">
                (${formatUSDPrice(usdValue)})
              </span>
            )}
          </p>
          {nft.rarity && (
            <p className="text-sm text-gray-500">Rank: {nft.rarity}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex transform cursor-pointer flex-col items-center rounded-lg p-2 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
      onClick={() => onClick(nft.id)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={`${collection} #${nftId}`}
          className="h-full w-full"
          shape={shape}
        />
      </div>
      <div className="mt-2 w-full text-center">
        <p className="text-sm font-semibold">#{nftId}</p>
        {nft.rarity && (
          <p className="text-xs text-gray-500">Rank: {nft.rarity}</p>
        )}
        {isForSale && showPriceInfo && (
          <p className="text-xs font-bold text-green-500">
            {formatEthPrice(ethValue)}Ξ
            {usdValue && (
              <span className="ml-1 text-xs text-gray-500">
                (${formatUSDPrice(usdValue)})
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
