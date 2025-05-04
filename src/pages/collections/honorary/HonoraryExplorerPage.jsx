import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReadContract } from "thirdweb/react";
import { useMarketplace } from "../../../contexts/MarketplaceContext";
import {
  honoraryContract,
  HonoraryContractAddress,
} from "../../../consts/contracts";
import VirtualizedNFTGrid from "../../../components/nft/VirtualizedNFTGrid";
import VirtualizedSaleGrid from "../../../components/marketplace/VirtualizedSaleGrid";
import useEthPrice from "../../../hooks/useEthPrice";

const HonoraryExplorerPage = () => {
  const navigate = useNavigate();
  const { listings } = useMarketplace();
  const [honoraryListings, setHonoraryListings] = useState([]);
  const [activeTab, setActiveTab] = useState("nfts");
  const { ethPrice, loading: ethPriceLoading } = useEthPrice();

  const { data: totalSupply } = useReadContract({
    contract: honoraryContract,
    method: "function totalSupply() view returns (uint256)",
    params: [],
  });

  useEffect(() => {
    const filteredListings = listings.filter(
      (listing) => listing.assetContract === HonoraryContractAddress
    );
    setHonoraryListings(filteredListings);
  }, [listings]);

  const handleNFTClick = (nftId) => {
    navigate(`/collection/Honorary/token/${nftId}`);
  };

  const allNFTs = useMemo(() => {
    return Array.from({ length: Number(totalSupply) || 0 }, (_, index) => ({
      id: index,
      name: `Honorary #${index}`,
    }));
  }, [totalSupply]);

  const onSaleNFTs = useMemo(() => {
    return allNFTs.filter((nft) =>
      honoraryListings.some(
        (listing) => Number(listing.tokenId) === Number(nft.id)
      )
    );
  }, [allNFTs, honoraryListings]);

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <h1 className="mb-6 text-4xl font-bold">Honorary Collection</h1>
            <p className="mb-8 text-base text-zinc-600 dark:text-zinc-400">
              We all have that inner bull, ready to charge!
              <br />
              This exclusive collection honors those who share the bullish
              spirit by transforming them into BlockyBulls.
              <br />
              You can also view and trade the collections on{" "}
              <a
                href="https://opensea.io/collection/blockybulls-honorary-bulls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                OpenSea
              </a>{" "}
              and{" "}
              <a
                href="https://magiceden.io/collections/base/0xd3aff8a8f31ce60c9e1b5221a22503ebba7f1688"
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
                  <p>{allNFTs.length} Honorary NFTs found.</p>
                </div>
                <VirtualizedNFTGrid
                  nfts={allNFTs}
                  blockyBullsListings={honoraryListings}
                  ethPrice={ethPrice}
                  onNFTClick={handleNFTClick}
                  collection="honorary"
                />
              </div>
            )}

            {activeTab === "onSale" && (
              <div>
                {onSaleNFTs.length > 0 ? (
                  <>
                    <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                      <p>{onSaleNFTs.length} Honorary NFTs on sale</p>
                    </div>
                    <VirtualizedSaleGrid
                      nfts={onSaleNFTs}
                      listings={honoraryListings}
                      ethPrice={ethPrice}
                      onNFTClick={handleNFTClick}
                      collection={"honorary"}
                    />
                  </>
                ) : (
                  <p className="mb-8">
                    No Honorary NFTs are currently on sale on this marketplace.
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

export default HonoraryExplorerPage;
