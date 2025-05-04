import React, { useState, useEffect } from "react";
import { TransactionButton } from "thirdweb/react";
import { ethers } from "ethers";
import { X, DollarSign, Loader } from "lucide-react";

const CreateListingPopup = ({ isOpen, onClose, handleCreateListing }) => {
  const [price, setPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

  const getDefaultEndDate = () => {
    const defaultEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 3000);
    defaultEnd.setMinutes(
      defaultEnd.getMinutes() - defaultEnd.getTimezoneOffset()
    );
    return defaultEnd.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      // Reset form data when opening a new dialog
      setPrice("");
      setEndDate(getDefaultEndDate());
      setTxHash("");
      setError("");
      setIsTransactionInProgress(false);
    }
  }, [isOpen]);

  const getMinEndDateTime = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1); // Set minimum to tomorrow
    minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
    return minDate.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  const handleSubmit = () => {
    const priceInWei = ethers.utils.parseEther(price || "0");
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    return handleCreateListing(
      priceInWei,
      endTimestamp,
      (result) => {
        console.log("Listing creation transaction sent", result);
        setError("");
        setTxHash(result.transactionHash);
        setIsTransactionInProgress(true);
      },
      (receipt) => {
        console.log("Listing creation transaction confirmed", receipt);
        setError("");
        setIsTransactionInProgress(false);
        onClose(); // Close the dialog after confirmation
      },
      (error) => {
        console.error("Listing creation error", error);
        setError(`Unable to list the NFT. Please try again.`);
        setIsTransactionInProgress(false);
      }
    );
  };

  const renderTransactionLink = () => {
    if (!txHash) return null;

    return (
      <a
        href={`https://sepolia.basescan.org/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {txHash.slice(0, 10)}...{txHash.slice(-10)}
      </a>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold">Create Listing</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Set the price and end date for your NFT listing. This will make your
          NFT available for purchase on the marketplace until the specified end
          date.
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {isTransactionInProgress ? (
          <div className="flex flex-col items-center">
            <Loader className="mb-4 animate-spin" size={24} />
            <p className="mb-2">Transaction in progress...</p>
            {<span>View on Etherscan: </span> && renderTransactionLink()}
          </div>
        ) : (
          <>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price in ETH"
              className="mb-4 w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={getMinEndDateTime()}
              className="mb-4 w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex min-w-[120px] items-center justify-center rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              >
                <X className="mr-2 flex-shrink-0" size={16} />
                <span>Cancel</span>
              </button>
              <TransactionButton
                {...handleSubmit()}
                disabled={!price || !endDate}
                className="flex min-w-[150px] items-center justify-center whitespace-nowrap rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 hover:text-white"
              >
                <div className="flex items-center">
                  <DollarSign className="mr-2 flex-shrink-0" size={16} />
                  Create Listing
                </div>
              </TransactionButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateListingPopup;
