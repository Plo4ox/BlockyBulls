import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import optimizedData from "../data/optimizedAttributeData.json";
import { useMarketplace } from "../../../contexts/MarketplaceContext";
import { BlockyBullsContractAddress } from "../../../consts/contracts";
import VirtualizedNFTGrid from "../../../components/nft/VirtualizedNFTGrid";
import VirtualizedSaleGrid from "../../../components/marketplace/VirtualizedSaleGrid";
import useEthPrice from "../../../hooks/useEthPrice";

const BlockyBullsExplorerPage = () => {
  const navigate = useNavigate();
  const { attribute } = useParams();
  const location = useLocation();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const { listings } = useMarketplace();
  const [blockyBullsListings, setBlockyBullsListings] = useState([]);
  const [activeTab, setActiveTab] = useState("nfts");
  const [sortByRarity, setSortByRarity] = useState(false);
  const { ethPrice, loading: ethPriceLoading } = useEthPrice();

  useEffect(() => {
    const filteredListings = listings.filter(
      (listing) => listing.assetContract === BlockyBullsContractAddress
    );
    setBlockyBullsListings(filteredListings);
  }, [listings]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const option = searchParams.get("option");
    const category = searchParams.get("category");
    const tab = searchParams.get("tab");
    if (category && option) {
      setSelectedAttributes({ [category]: option || "" });
    }
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const calculateMatchingCounts = useMemo(() => {
    return (currentSelection) => {
      const counts = {};

      Object.entries(optimizedData.attributeOptions).forEach(
        ([attr, options]) => {
          counts[attr] = {};

          let matchingNFTs = new Set(Object.keys(optimizedData.nfts));
          Object.entries(currentSelection).forEach(([selAttr, selValue]) => {
            if (selValue !== "" && selAttr !== attr) {
              const nftsWithAttribute = new Set(
                optimizedData.nftsByAttribute[selAttr][selValue]
              );
              matchingNFTs = new Set(
                [...matchingNFTs].filter((id) => nftsWithAttribute.has(id))
              );
            }
          });

          options.forEach((option) => {
            const nftsWithAttribute = new Set(
              optimizedData.nftsByAttribute[attr][option]
            );
            counts[attr][option] = new Set(
              [...matchingNFTs].filter((id) => nftsWithAttribute.has(id))
            ).size;
          });
        }
      );

      return counts;
    };
  }, []);

  const [matchingCounts, setMatchingCounts] = useState(
    calculateMatchingCounts(selectedAttributes)
  );

  useEffect(() => {
    setMatchingCounts(calculateMatchingCounts(selectedAttributes));

    var filtered = Object.values(optimizedData.nfts);
    if (Object.values(selectedAttributes).some((value) => value !== "")) {
      let matchingNFTs = new Set(Object.keys(optimizedData.nfts));
      Object.entries(selectedAttributes).forEach(([attr, value]) => {
        if (value !== "") {
          const nftsWithAttribute = new Set(
            optimizedData.nftsByAttribute[attr][value]
          );
          matchingNFTs = new Set(
            [...matchingNFTs].filter((id) => nftsWithAttribute.has(id))
          );
        }
      });

      filtered = Array.from(matchingNFTs).map((id) => optimizedData.nfts[id]);
    }

    if (sortByRarity) {
      filtered.sort((a, b) => a.rarity - b.rarity);
    } else {
      filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    }

    setFilteredNFTs(filtered);
  }, [selectedAttributes, calculateMatchingCounts, sortByRarity]);

  const handleAttributeChange = (attr, value) => {
    setSelectedAttributes((prev) => {
      const newAttributes = { ...prev, [attr]: value };
      if (value === "") {
        delete newAttributes[attr];
      }
      return newAttributes;
    });
  };

  const handleNFTClick = (nftId) => {
    navigate(`/collection/BlockyBulls/token/${Number(nftId) - 1}`);
  };

  const toggleSortByRarity = () => {
    setSortByRarity((prev) => !prev);
  };

  const onSaleNFTs = useMemo(() => {
    return filteredNFTs.filter((nft) => {
      return blockyBullsListings.some(
        (listing) => Number(listing.tokenId) === Number(nft.id) - 1
      );
    });
  }, [filteredNFTs, blockyBullsListings]);

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold">BlockyBulls Collection</h1>

            <p className="mb-8 text-base text-zinc-600 dark:text-zinc-400">
              Discover the perfect BlockyBulls for you by selecting the wanted{" "}
              <Link
                to="/collection/BlockyBulls/attributes"
                className="text-blue-500 hover:underline"
              >
                attributes
              </Link>
              !<br />
              The ranking uses OpenRarity similar to OpenSea and excludes burnt
              items (
              <a
                href="https://mirror.xyz/blockybulls.eth/6-H05mKkuBsZJNU2YJ6IppRVEYk36-KSQCOzVA-BKYQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Why were 4.5k burned?
              </a>
              )<br />
              You can also view and trade the collections on{" "}
              <a
                href="https://opensea.io/collection/blockybulls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                OpenSea
              </a>{" "}
              and{" "}
              <a
                href="https://magiceden.io/collections/base/0xd9d98a369bbaa3934304d6acbf9013e33e2a3368"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                MagicEden
              </a>
            </p>
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(optimizedData.attributeOptions).map(
                  ([attr, options]) => (
                    <div key={attr}>
                      <h3 className="mb-2 font-semibold">{attr}</h3>
                      <select
                        className="w-full rounded border bg-gray-800 p-2 text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        onChange={(e) =>
                          handleAttributeChange(attr, e.target.value)
                        }
                        value={selectedAttributes[attr] || ""}
                      >
                        <option value="">Any</option>
                        {options.map((option, index) => (
                          <option key={index} value={option}>
                            {option} ({matchingCounts[attr][option]})
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                )}
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
                  <p>
                    {filteredNFTs.length} BlockyBulls found.
                    {Object.keys(selectedAttributes).length > 0 && (
                      <>
                        <br />
                        With{" "}
                        {Object.entries(selectedAttributes).map(
                          ([key, value], index) => (
                            <span key={key}>
                              {key}: <b className="text-blue-500">{value}</b>
                              {index <
                              Object.entries(selectedAttributes).length - 1
                                ? ", "
                                : ""}
                            </span>
                          )
                        )}
                      </>
                    )}
                  </p>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sortByRarity}
                      onChange={toggleSortByRarity}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Sort by rarity
                    </span>
                  </label>
                </div>
                <VirtualizedNFTGrid
                  nfts={filteredNFTs}
                  blockyBullsListings={blockyBullsListings}
                  ethPrice={ethPrice}
                  onNFTClick={handleNFTClick}
                  collection="blockybulls"
                  showPriceInfo={false}
                />
              </div>
            )}

            {activeTab === "onSale" && (
              <div>
                {onSaleNFTs.length > 0 ? (
                  <>
                    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <p>
                        {onSaleNFTs.length} BlockyBulls on sale
                        {Object.keys(selectedAttributes).length > 0 && (
                          <>
                            <br />
                            With{" "}
                            {Object.entries(selectedAttributes).map(
                              ([key, value], index) => (
                                <span key={key}>
                                  {key}:{" "}
                                  <b className="text-blue-500">{value}</b>
                                  {index <
                                  Object.entries(selectedAttributes).length - 1
                                    ? ", "
                                    : ""}
                                </span>
                              )
                            )}
                          </>
                        )}
                      </p>
                    </div>
                    <VirtualizedSaleGrid
                      nfts={onSaleNFTs}
                      listings={blockyBullsListings}
                      ethPrice={ethPrice}
                      onNFTClick={handleNFTClick}
                      collection={"blockybulls"}
                    />
                  </>
                ) : (
                  <p className="mb-8">
                    No BlockyBulls are currently on sale on this marketplace for
                    the selected attributes.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockyBullsExplorerPage;
