import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReadContract } from "thirdweb/react";
import { useMarketplace } from "../../../contexts/MarketplaceContext";
import { btbContract, BTBContractAddress } from "../../../consts/contracts";
import VirtualizedNFTGrid from "../../../components/nft/VirtualizedNFTGrid";
import VirtualizedSaleGrid from "../../../components/marketplace/VirtualizedSaleGrid";
import useEthPrice from "../../../hooks/useEthPrice";

const BeyondTheBlockExplorerPage = () => {
  const navigate = useNavigate();
  const { listings } = useMarketplace();
  const [btbListings, setBtbListings] = useState([]);
  const [activeTab, setActiveTab] = useState("nfts");
  const { ethPrice, loading: ethPriceLoading } = useEthPrice();

  const { data: totalSupply } = useReadContract({
    contract: btbContract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });

  useEffect(() => {
    const filteredListings = listings.filter(
      (listing) => listing.assetContract === BTBContractAddress
    );
    setBtbListings(filteredListings);
  }, [listings]);

  const handleNFTClick = (nftId) => {
    navigate(`/collection/BeyondTheBlock/token/${nftId}`);
  };

  const allNFTs = useMemo(() => {
    return Array.from({ length: Number(totalSupply) || 0 }, (_, index) => ({
      id: index,
      name: `Beyond The Block #${index}`,
    }));
  }, [totalSupply]);

  const onSaleNFTs = useMemo(() => {
    return allNFTs.filter((nft) =>
      btbListings.some((listing) => Number(listing.tokenId) === Number(nft.id))
    );
  }, [allNFTs, btbListings]);

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold">
              Beyond The Block Collection
            </h1>
            <p className="mb-8 text-base text-zinc-600 dark:text-zinc-400">
              Discover your favorite icons reimagined as BlockyBulls!
              <br />
              This collection brings iconic figures and pop culture legends into
              the BlockyBulls universe.
              <br />
              You can also view and trade the collections on{" "}
              <a
                href="https://opensea.io/collection/blockybulls-beyond-the-block"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                OpenSea
              </a>{" "}
              and{" "}
              <a
                href="https://magiceden.io/collections/base/0x50344910d047daa13a164c991aebe39aba170ca5"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                MagicEden
              </a>
            </p>

            <div className="mb-4 flex">
              <button
                className={`px-4 py-2 font-semibold ${
                  activeTab === "nfts"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("nfts")}
              >
                All NFTs ({allNFTs.length})
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
                  <p>{allNFTs.length} Beyond The Block NFTs found.</p>
                </div>
                <VirtualizedNFTGrid
                  nfts={allNFTs}
                  blockyBullsListings={btbListings}
                  ethPrice={ethPrice}
                  onNFTClick={handleNFTClick}
                  collection="btb"
                />
              </div>
            )}

            {activeTab === "onSale" && (
              <div>
                {onSaleNFTs.length > 0 ? (
                  <>
                    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <p>{onSaleNFTs.length} Beyond The Block NFTs on sale</p>
                    </div>
                    <VirtualizedSaleGrid
                      nfts={onSaleNFTs}
                      listings={btbListings}
                      ethPrice={ethPrice}
                      onNFTClick={handleNFTClick}
                      collection={"btb"}
                    />
                  </>
                ) : (
                  <p className="mb-8">
                    No Beyond The Block NFTs are currently on sale on this
                    marketplace.
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

export default BeyondTheBlockExplorerPage;
