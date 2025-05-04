import React, { useState, useEffect } from "react";
import { TransactionButton } from "thirdweb/react";
import { Check, X, Loader } from "lucide-react";

const ApprovalDialog = ({
  isOpen,
  onClose,
  handleApprove,
  marketplaceAddress,
}) => {
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTxHash("");
      setError("");
      setIsTransactionInProgress(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApproveClick = () => {
    return handleApprove(
      (result) => {
        console.log("Approval transaction sent", result);
        setTxHash(result.transactionHash);
        setError("");
        setIsTransactionInProgress(true);
      },
      (receipt) => {
        console.log("Approval transaction confirmed", receipt);
        setError("");
        setIsTransactionInProgress(false);
        onClose(); // Close the dialog after confirmation
      },
      (error) => {
        console.error("Approval error", error);
        setIsTransactionInProgress(false);
        setError(
          `Unable to approve the collection. Please try again. Error: ${error.message}`
        );
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
        <h2 className="mb-4 text-2xl font-bold">
          Approve Collection for Marketplace
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Before listing your NFT, you need to approve the collection for use in
          the marketplace.
          <br />
          This is a one-time process for this collection.
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {isTransactionInProgress ? (
          <div className="flex flex-col items-center">
            <Loader className="mb-4 animate-spin" size={24} />
            <p className="mb-2">Transaction in progress...</p>
            {<span>View on Etherscan: </span> && renderTransactionLink()}
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex min-w-[120px] items-center justify-center rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              <X className="mr-2 flex-shrink-0" size={16} />
              <span>Cancel</span>
            </button>
            <TransactionButton
              {...handleApproveClick()}
              disabled={isTransactionInProgress}
              className="flex min-w-[150px] items-center justify-center whitespace-nowrap rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 hover:text-white"
            >
              <div className="flex items-center">
                <Check className="mr-2 flex-shrink-0" size={16} />
                <span>Approve Collection</span>
              </div>
            </TransactionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalDialog;
