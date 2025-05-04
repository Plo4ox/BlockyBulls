import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReadContract } from "thirdweb/react";
import { readContract } from "thirdweb";
import { useMarketplace } from "../../../contexts/MarketplaceContext";
import {
  basedSnoutContract,
  BasedSnoutContractAddress,
} from "../../../consts/contracts";
import BSVirtualizedNFTGrid from "../../../components/nft/BSVirtualizedNFTGrid";
import BSVirtualizedSaleGrid from "../../../components/marketplace/BSVirtualizedSaleGrid";
import useEthPrice from "../../../hooks/useEthPrice";
import { Link } from "react-router-dom";

const BATCH_SIZE = 50;

const BasedSnoutExplorerPage = () => {
  const navigate = useNavigate();
  const { listings } = useMarketplace();
  const [basedSnoutListings, setBasedSnoutListings] = useState([]);
  const [activeTab, setActiveTab] = useState("nfts");
  const { ethPrice, loading: ethPriceLoading } = useEthPrice();
  const [metadata, setMetadata] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [attributeOptions, setAttributeOptions] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: totalSupply } = useReadContract({
    contract: basedSnoutContract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });

  useEffect(() => {
    const filteredListings = listings.filter(
      (listing) => listing.assetContract === BasedSnoutContractAddress
    );
    setBasedSnoutListings(filteredListings);
  }, [listings]);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (totalSupply) {
        setIsLoading(true);
        const total = Number(totalSupply);
        let allMetadata = [];

        for (let i = 0; i < total; i += BATCH_SIZE) {
          const end = Math.min(i + BATCH_SIZE, total);
          const batch = Array.from(
            { length: end - i },
            (_, index) => i + index
          );

          const batchPromises = batch.map((tokenId) =>
            readContract({
              contract: basedSnoutContract,
              method:
                "function tokenURI(uint256 tokenId) view returns (string)",
              params: [tokenId + 1],
            }).catch(() => null)
          );

          const batchResults = await Promise.all(batchPromises);
          const validResults = batchResults.filter((result) => result !== null);

          const parsedBatch = validResults.map((uri, index) => {
            const json = JSON.parse(atob(uri.split(",")[1]));
            return { id: i + index + 1, ...json };
          });

          allMetadata = [...allMetadata, ...parsedBatch];
        }

        setMetadata(allMetadata);

        // Process attributes
        const attributes = {};
        allMetadata.forEach((nft) => {
          nft.attributes.forEach((attr) => {
            if (!attributes[attr.trait_type]) {
              attributes[attr.trait_type] = new Set();
            }
            attributes[attr.trait_type].add(attr.value);
          });
        });

        // Convert Sets to Arrays
        Object.keys(attributes).forEach((key) => {
          attributes[key] = Array.from(attributes[key]);
        });

        setAttributeOptions(attributes);
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [totalSupply]);

  const handleNFTClick = (nftId) => {
    navigate(`/collection/BasedSnout/token/${nftId}`);
  };

  const handleAttributeChange = (attr, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attr]: value === "" ? undefined : value,
    }));
  };

  const filteredNFTs = useMemo(() => {
    return metadata.filter((nft) =>
      Object.entries(selectedAttributes).every(
        ([attr, value]) =>
          value === undefined ||
          (nft.attributes &&
            nft.attributes.some(
              (a) => a.trait_type === attr && a.value === value
            ))
      )
    );
  }, [metadata, selectedAttributes]);

  const onSaleNFTs = useMemo(() => {
    return filteredNFTs.filter((nft) =>
      basedSnoutListings.some(
        (listing) => Number(listing.tokenId) === Number(nft.id)
      )
    );
  }, [filteredNFTs, basedSnoutListings]);

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold">BasedSnout Collection</h1>
            <p className="mb-8 text-base text-zinc-600 dark:text-zinc-400">
              Discover the perfect BasedSnout for you by selecting the wanted
              attributes!
              <br />
              Or <span className="font-bold text-white">mint yours</span>{" "}
              directly from the{" "}
              <Link
                to="/bbverse/basedSnout/"
                className="font-bold text-blue-500 hover:underline"
              >
                BasedSnout Page
              </Link>
              !<br />
              You can also view and trade the collections on{" "}
              <a
                href="https://opensea.io/collection/basedsnout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                OpenSea
              </a>{" "}
              and{" "}
              <a
                href="https://magiceden.io/collections/base/0xa4f353a0e294ec6deb943dbd7f56a5c315b6f65b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                MagicEden
              </a>
            </p>

            {isLoading ? (
              <div className="mb-8">Loading...</div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Object.entries(attributeOptions).map(([attr, options]) => (
                      <div key={attr}>
                        <h3 className="mb-2 font-semibold">{attr}</h3>
                        <select
                          className="w-full cursor-pointer appearance-none rounded border border-gray-600 bg-gray-800 p-2 text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) =>
                            handleAttributeChange(attr, e.target.value)
                          }
                          value={selectedAttributes[attr] || ""}
                        >
                          <option value="">Any</option>
                          {options.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex">
                  <button
                    className={`px-4 py-2 font-semibold ${
                      activeTab === "nfts"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("nfts")}
                  >
                    All NFTs ({filteredNFTs.length})
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${
                      activeTab === "onSale"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("onSale")}
                  >
                    On Sale ({onSaleNFTs.length})
                  </button>
                </div>

                {activeTab === "nfts" && (
                  <div>
                    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <p>{filteredNFTs.length} Based Snout NFTs found.</p>
                    </div>
                    <BSVirtualizedNFTGrid
                      nfts={filteredNFTs}
                      blockyBullsListings={basedSnoutListings}
                      ethPrice={ethPrice}
                      onNFTClick={handleNFTClick}
                      collection="BasedSnout"
                      contract={basedSnoutContract}
                    />
                  </div>
                )}

                {activeTab === "onSale" && (
                  <div>
                    {onSaleNFTs.length > 0 ? (
                      <>
                        <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                          <p>{onSaleNFTs.length} Based Snout NFTs on sale</p>
                        </div>
                        <BSVirtualizedSaleGrid
                          nfts={onSaleNFTs}
                          listings={basedSnoutListings}
                          ethPrice={ethPrice}
                          onNFTClick={handleNFTClick}
                          contract={basedSnoutContract}
                        />
                      </>
                    ) : (
                      <p className="mb-8">
                        No Based Snout NFTs are currently on sale on this
                        marketplace.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasedSnoutExplorerPage;
