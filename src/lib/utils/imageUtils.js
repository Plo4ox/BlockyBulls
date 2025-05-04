import backgroundData from "../data/backgrounds.json";

export function getNFTImageUrl(collection, tokenId, options = {}) {
  const { size = "medium", background = "none", shape = "square" } = options;

  // Map size strings to actual pixel dimensions
  const sizeMap = {
    small: "64",
    medium: "256",
    large: "512",
  };

  // Use the size from the map or use the provided size if it's a number
  const imageSize = sizeMap[size] || size;

  // For BlockyBulls, we can use the background and no-background images
  if (collection.toLowerCase() === "blockybulls") {
    // For BlockyBulls, token IDs need +1 adjustment for the image URLs
    const adjustedTokenId = Number(tokenId) + 1;

    if (background === "base") {
      return {
        background: "/bb/bg/Base.png",
        character: `/bb/nobg/${adjustedTokenId}.png`,
      };
    }

    if (background === "none") {
      return {
        background: `/bb/bg/${getBackgroundForNFT(tokenId)}.png`,
        character: `/bb/nobg/${adjustedTokenId}.png`,
      };
    }
  }

  if (
    collection.toLowerCase() === "beyondtheblock" ||
    collection.toLowerCase() === "btb"
  ) {
    return `/btb/${tokenId}.png`;
  }

  if (collection.toLowerCase() === "honorary") {
    return `/honorary/${tokenId}.png`;
  }

  return "/images/placeholder.png";
}

export const getBackgroundForNFT = (nftId) => {
  const backgroundIndex = parseInt(nftId); // Assuming NFT IDs start at 1
  return backgroundData[backgroundIndex] || "Base";
};
