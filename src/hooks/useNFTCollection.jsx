import { useState, useEffect, useMemo } from "react";
import { useReadContract } from "thirdweb/react";
import { readContract } from "thirdweb";

export const useNFTCollection = (options = {}) => {
  const {
    contract,
    collection,
    fetchRarity = false,
    batchSize = 50,
    filterAttributes = true,
  } = options;

  const [nfts, setNfts] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get total NFTs in the collection
  const { data: totalSupply } = useReadContract({
    contract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });

  // Fetch NFT metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!totalSupply || !contract) return;

      try {
        setIsLoading(true);
        const total = Number(totalSupply);
        let allMetadata = [];

        // For BlockyBulls, we might want to fetch rarity data
        let rarityData = null;
        if (fetchRarity && collection.toLowerCase() === "blockybulls") {
          try {
            const rarityResponse = await fetch(`/api/rarity/all`);
            if (rarityResponse.ok) {
              rarityData = await rarityResponse.json();
            }
          } catch (err) {
            console.error("Error fetching rarity data:", err);
          }
        }

        // Fetch metadata in batches to avoid overloading the network
        for (let i = 0; i < total; i += batchSize) {
          const end = Math.min(i + batchSize, total);
          const batch = Array.from(
            { length: end - i },
            (_, index) => i + index
          );

          const batchPromises = batch.map((tokenId) =>
            readContract({
              contract,
              method:
                "function tokenURI(uint256 tokenId) view returns (string)",
              params: [tokenId],
            }).catch((e) => {
              console.error(`Error fetching token ${tokenId}:`, e);
              return null;
            })
          );

          const batchResults = await Promise.all(batchPromises);

          // Process results
          const parsedBatch = batchResults
            .filter((result) => result !== null)
            .map((uri, index) => {
              const tokenId = i + index;

              try {
                let metadata;
                // Handle different URI formats
                if (uri.startsWith("data:application/json;base64,")) {
                  const base64Data = uri.split(",")[1];
                  metadata = JSON.parse(atob(base64Data));
                } else if (uri.startsWith("ipfs://")) {
                  // For IPFS, you'd need to fetch from IPFS gateway
                  metadata = { name: `${collection} #${tokenId}` }; // Placeholder
                } else {
                  metadata = { name: `${collection} #${tokenId}` }; // Placeholder
                }

                // Add rarity data if available
                if (rarityData && rarityData[tokenId]) {
                  metadata.rarity = rarityData[tokenId].rank;
                }

                return {
                  id: tokenId,
                  ...metadata,
                };
              } catch (e) {
                console.error(
                  `Error parsing metadata for token ${tokenId}:`,
                  e
                );
                return {
                  id: tokenId,
                  name: `${collection} #${tokenId}`,
                };
              }
            });

          allMetadata = [...allMetadata, ...parsedBatch];
        }

        // Process attributes for filtering
        if (filterAttributes) {
          const attributes = {};
          allMetadata.forEach((nft) => {
            if (nft.attributes) {
              nft.attributes.forEach((attr) => {
                if (!attributes[attr.trait_type]) {
                  attributes[attr.trait_type] = new Set();
                }
                attributes[attr.trait_type].add(attr.value);
              });
            }
          });

          // Convert Sets to Arrays
          const processedAttributes = {};
          Object.entries(attributes).forEach(([key, values]) => {
            processedAttributes[key] = Array.from(values);
          });

          setAttributeOptions(processedAttributes);
        }

        setNfts(allMetadata);
      } catch (err) {
        console.error("Error fetching NFT data:", err);
        setError(err.message || "Failed to load NFT data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [
    totalSupply,
    contract,
    collection,
    fetchRarity,
    batchSize,
    filterAttributes,
  ]);

  // Handle attribute selection for filtering
  const handleAttributeChange = (attr, value) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev };
      if (value === "") {
        delete newAttributes[attr];
      } else {
        newAttributes[attr] = value;
      }
      return newAttributes;
    });
  };

  // Apply filters to NFTs
  const filteredNfts = useMemo(() => {
    if (Object.keys(selectedAttributes).length === 0) return nfts;

    return nfts.filter((nft) =>
      Object.entries(selectedAttributes).every(([attr, value]) => {
        if (!nft.attributes) return false;
        return nft.attributes.some(
          (a) => a.trait_type === attr && a.value === value
        );
      })
    );
  }, [nfts, selectedAttributes]);

  // Calculate frequency of attributes for current filter selection
  const attributeFrequency = useMemo(() => {
    if (!filterAttributes || Object.keys(attributeOptions).length === 0)
      return {};

    const baseNfts = nfts.filter((nft) =>
      Object.entries(selectedAttributes).every(([attr, value]) => {
        if (!nft.attributes) return false;
        return nft.attributes.some(
          (a) => a.trait_type === attr && a.value === value
        );
      })
    );

    const frequency = {};

    Object.keys(attributeOptions).forEach((traitType) => {
      frequency[traitType] = {};

      attributeOptions[traitType].forEach((traitValue) => {
        const count = baseNfts.filter(
          (nft) =>
            nft.attributes &&
            nft.attributes.some(
              (attr) =>
                attr.trait_type === traitType && attr.value === traitValue
            )
        ).length;

        frequency[traitType][traitValue] = {
          count,
          percentage: ((count / baseNfts.length) * 100).toFixed(1),
        };
      });
    });

    return frequency;
  }, [nfts, attributeOptions, selectedAttributes, filterAttributes]);

  return {
    nfts,
    filteredNfts,
    isLoading,
    error,
    totalSupply: totalSupply ? Number(totalSupply) : 0,
    attributeOptions,
    selectedAttributes,
    attributeFrequency,
    handleAttributeChange,
    setSelectedAttributes,
  };
};
