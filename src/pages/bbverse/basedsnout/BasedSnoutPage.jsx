// BasedSnoutPage.jsx

import React, { useState, useEffect } from "react";
import {
  useReadContract,
  useActiveAccount,
  MediaRenderer,
  TransactionButton,
} from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useToast } from "../../../hooks/use-toast";
import {
  BasedSnoutContractAddress,
  basedSnoutContract,
  blockyBullsContract,
} from "../../../consts/contracts";
import RandomSnoutGenerator from "./RandomSnoutGenerator";
import SnoutSVGLib from "./SnoutSVGLib";
import MintingAnimation from "./MintingAnimation";
import MintProgressBar from "./MintProgressBar";
import { useNavigate } from "react-router-dom";

export default function BasedSnoutPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [mintType, setMintType] = useState("normal");
  const [showTransactionHash, setShowTransactionHash] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [mintPrice, setMintPrice] = useState("0");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [mintedSnoutSVG, setMintedSnoutSVG] = useState("");
  const [mintingAddress, setMintingAddress] = useState("");

  const { data: totalSupply } = useReadContract({
    contract: basedSnoutContract,
    method: "totalSupply",
  });

  const { data: ownedNFTs, ownedIsLoading } = useReadContract(getOwnedNFTs, {
    contract: basedSnoutContract,
    owner: activeAccount?.address,
  });

  const { data: mintCount, mintCountLoading } = useReadContract({
    contract: basedSnoutContract,
    method: "mintCount",
    params: [activeAccount?.address],
  });

  const { data: isWhitelisted } = useReadContract({
    contract: basedSnoutContract,
    method: "isWhitelisted",
    params: [activeAccount?.address],
  });

  const { data: blockyBullBalance } = useReadContract({
    contract: blockyBullsContract,
    method: "balanceOf",
    params: [activeAccount?.address],
  });

  const SkeletonLoader = () => (
    <div className="mb-4 grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="aspect-square w-full rounded-lg bg-gray-300 dark:bg-gray-600"
        ></div>
      ))}
    </div>
  );

  const UserSnoutsSection = () => {
    if (!activeAccount) {
      return null;
    }

    return (
      <div className="mb-8 mt-10 p-4">
        <h2 className="mb-4 text-2xl font-bold">Your Based Snouts</h2>
        {ownedIsLoading ? (
          <SkeletonLoader />
        ) : ownedNFTs && ownedNFTs.length > 0 ? (
          <>
            <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {ownedNFTs.map((nft) => (
                <a
                  key={nft.id}
                  href={`https://opensea.io/assets/base/${BasedSnoutContractAddress}/${nft.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square w-full"
                >
                  <MediaRenderer
                    src={nft.metadata.image}
                    alt={`Based Snout #${nft.id}`}
                    className="rounded-lg object-cover"
                    height="100"
                  />
                </a>
              ))}
            </div>
          </>
        ) : (
          <p>You don't have any Based Snouts yet. Mint one to get started!</p>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (mintCount !== undefined) {
      if (isWhitelisted) {
        setMintType("whitelist");
        setMintPrice(["0", "0.0001", "0.001", "0.01"][mintCount]);
      } else if (blockyBullBalance > 0) {
        setMintType("blockyBull");
        setMintPrice(["0.0001", "0.001", "0.01", "0.1"][mintCount]);
      } else {
        setMintType("normal");
        setMintPrice(["0.001", "0.01", "0.1", "1"][mintCount]);
      }
    }
  }, [mintCount, isWhitelisted, blockyBullBalance]);

  const generateMintedSnoutSVG = () => {
    const lib = new SnoutSVGLib();
    const svg = lib.generateSVG(mintCount, activeAccount?.address, 256, 256);
    setMintedSnoutSVG(svg);
  };

  const formatTransactionHash = (hash) => {
    if (hash.length <= 12) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <div className="mt-16 sm:px-8">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <header className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Welcome to BasedSnout!
              </h1>
              <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
                Where bullish vibes meet blockchain art!
                <br />
                Each unique Snout is your personal bull market detector,
                algorithmically generated from your Ethereum address.
                <br />
                <br />
                Mint yours and join a herd that stays bullish in any market.
                <br />
                The most bullish will take their snout representation to the
                next level!
                <br />
                <a
                  href={`https://basescan.org/address/${BasedSnoutContractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View contract on Basescan
                </a>
              </p>
              {totalSupply !== undefined && (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">
                  Total Snouts Minted: {totalSupply.toString()} (
                  <span
                    className="pointer text-blue-500 hover:underline"
                    onClick={() => navigate("/collection/BasedSnout/explorer")}
                  >
                    See More
                  </span>
                  )
                </p>
              )}
            </header>

            <div className="mt-10">
              <RandomSnoutGenerator mintCount={mintCount} />
            </div>

            {activeAccount && mintCount !== undefined && mintCount > 0 && (
              <MintProgressBar
                mintCount={mintCount}
                userAddress={activeAccount.address}
              />
            )}

            {activeAccount && mintCount !== undefined ? (
              <div className="mt-10 flex justify-center">
                {mintCount < 4 ? (
                  <TransactionButton
                    transaction={() => {
                      setTxHash("");
                      setShowTransactionHash(false);
                      setIsLoading(true);
                      setMintingAddress(activeAccount.address); // Set the minting address
                      const mintFunc =
                        mintType === "whitelist"
                          ? "whitelistMint"
                          : mintType === "blockyBull"
                          ? "blockyBullMint"
                          : "normalMint";

                      const tx = prepareContractCall({
                        contract: basedSnoutContract,
                        method: "function " + mintFunc + "() payable",
                        params: [],
                        value: toWei(mintPrice),
                      });
                      return tx;
                    }}
                    onTransactionSent={(result) => {
                      console.log("Transaction sent", result);
                      setTxHash(result.transactionHash);
                      setShowTransactionHash(true);
                    }}
                    onTransactionConfirmed={(receipt) => {
                      console.log(
                        "Transaction confirmed",
                        receipt.transactionHash
                      );
                      generateMintedSnoutSVG();
                      setShowSuccessDialog(true);
                      setIsLoading(false);
                      setShowTransactionHash(false);
                    }}
                    onError={(error) => {
                      console.error("Transaction error", error);
                      toast({
                        title: "Minting Failed",
                        description:
                          error?.message || "An error occurred while minting.",
                        variant: "destructive",
                      });
                      setIsLoading(false);
                      setShowTransactionHash(false);
                    }}
                    className="!rounded-lg !bg-blue-500 p-4 !text-white hover:!bg-blue-600"
                  >
                    {isLoading
                      ? "Minting..."
                      : mintPrice == "0"
                      ? `Mint Based Snout - Level ${mintCount} (Free)`
                      : `Mint Based Snout - Level ${mintCount} (${mintPrice} ETH)`}
                  </TransactionButton>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <p className="mb-8 mt-10 text-center text-zinc-600 dark:text-zinc-400">
                Connect your wallet to mint Based Snouts.
              </p>
            )}

            {blockyBullBalance == 0 &&
              activeAccount &&
              mintCount !== undefined && (
                <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                  Hold a{" "}
                  <a
                    href="https://opensea.io/collection/blockybulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    BlockyBull
                  </a>{" "}
                  to get discounted minting prices!
                </p>
              )}
            <UserSnoutsSection />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-80 rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold">Minting in Progress</h3>
            <div className="mb-4">
              <MintingAnimation address={mintingAddress} level={mintCount} />
            </div>
            <p className="text-center">
              Please wait while your snout is being minted...
              {showTransactionHash ? (
                <>
                  <br />
                  Transaction:{" "}
                  <a
                    href={"https://basescan.org/tx/" + txHash}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {formatTransactionHash(txHash)}
                  </a>
                </>
              ) : (
                <></>
              )}
            </p>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-bold">Minting Successful!</h3>
            <div className="mx-auto mb-4 h-64 w-64">
              <div dangerouslySetInnerHTML={{ __html: mintedSnoutSVG }} />
            </div>
            <p className="mb-4 text-center">
              Your Based Snout has been successfully minted.
              <br />
              View all the Snout on{" "}
              <a
                href="https://opensea.io/collection/basedsnout/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                OpenSea
              </a>
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
