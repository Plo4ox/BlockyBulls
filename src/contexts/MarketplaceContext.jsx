import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall, readContract } from "thirdweb";
import { marketplaceV3Contract } from "../consts/contracts";
import { useToast } from "../hooks/use-toast";
import { buyFromListing } from "thirdweb/extensions/marketplace";

// Create context
const MarketplaceContext = createContext();

/**
 * Hook to access the marketplace context
 * @returns {Object} Marketplace context value
 */
export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};

/**
 * Provider component for marketplace functionality
 */
export const MarketplaceProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [totalListingsCount, setTotalListingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const activeAccount = useActiveAccount();
  const { toast } = useToast();

  const LISTINGS_PER_PAGE = 100;

  // Get total number of listings from the contract
  const { data: totalListings } = useReadContract({
    contract: marketplaceV3Contract,
    method: "function totalListings() view returns (uint256)",
    params: [],
  });

  // Update totalListingsCount when data is received
  useEffect(() => {
    if (totalListings !== undefined) {
      setTotalListingsCount(Number(totalListings));
    }
  }, [totalListings]);

  /**
   * Fetches a batch of listings from the marketplace contract
   * @param {number} startId - Starting listing ID
   * @param {number} endId - Ending listing ID
   * @returns {Promise<Array>} - Array of listing objects
   */
  const fetchListings = useCallback(async (startId, endId) => {
    try {
      const fetchedListings = await readContract({
        contract: marketplaceV3Contract,
        method:
          "function getAllValidListings(uint256 _startId, uint256 _endId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved)[] _validListings)",
        params: [startId, endId],
      });

      return fetchedListings.map((listing) => ({
        id: listing.listingId.toString(),
        tokenId: listing.tokenId.toString(),
        quantity: listing.quantity.toString(),
        pricePerToken: listing.pricePerToken.toString(),
        startTimestamp: Number(listing.startTimestamp),
        endTimestamp: Number(listing.endTimestamp),
        listingCreator: listing.listingCreator,
        assetContract: listing.assetContract,
        currency: listing.currency,
        tokenType: listing.tokenType,
        status: listing.status,
        reserved: listing.reserved,
      }));
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  }, []);

  /**
   * Updates all listings data from the marketplace
   */
  const updateListings = useCallback(async () => {
    setIsLoading(true);
    let allListings = [];
    const totalPages = Math.ceil(totalListingsCount / LISTINGS_PER_PAGE);

    try {
      for (let page = 0; page < totalPages; page++) {
        const startId = page * LISTINGS_PER_PAGE;
        const endId =
          Math.min((page + 1) * LISTINGS_PER_PAGE, totalListingsCount) - 1;
        if (endId < startId) continue;

        const pageListings = await fetchListings(startId, endId);
        allListings = [...allListings, ...pageListings];
      }

      setListings(allListings);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error("Error updating listings:", error);
      toast({
        title: "Error fetching listings",
        description:
          "There was a problem loading marketplace listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [totalListingsCount, fetchListings, toast]);

  // Update listings when totalListingsCount changes
  useEffect(() => {
    if (totalListingsCount > 0) {
      updateListings();
    }
  }, [totalListingsCount, updateListings]);

  // Refresh listings periodically (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (totalListingsCount > 0) {
        updateListings();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [totalListingsCount, updateListings]);

  /**
   * Creates a listing for an NFT
   * @param {string} assetContract - NFT contract address
   * @param {string} tokenId - Token ID
   * @param {string} quantity - Quantity to list
   * @param {string} pricePerToken - Price per token in wei
   * @param {number} endTimestamp - Listing end timestamp
   * @returns {Function} - Transaction function for use with TransactionButton
   */
  const createListing = useCallback(
    (assetContract, tokenId, quantity, pricePerToken, endTimestamp) => {
      if (!activeAccount) return null;

      return (onSuccess, onError) => ({
        transaction: () => {
          const params = {
            assetContract,
            tokenId,
            quantity,
            currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
            pricePerToken,
            startTimestamp: Math.floor(Date.now() / 1000) - 1000,
            endTimestamp: endTimestamp,
            reserved: false,
          };
          return prepareContractCall({
            contract: marketplaceV3Contract,
            method:
              "function createListing((address assetContract, uint256 tokenId, uint256 quantity, address currency, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, bool reserved) _params) returns (uint256 listingId)",
            params: [params],
          });
        },
        onTransactionSent: (result) => {
          console.log("Transaction sent", result);
          toast({
            title: "Listing Created",
            description: "Your NFT has been listed on the marketplace.",
          });
          if (onSuccess) onSuccess(result);
        },
        onTransactionConfirmed: (receipt) => {
          console.log("Transaction confirmed", receipt);
          updateListings(); // Refresh listings after confirmation
        },
        onError: (error) => {
          console.error("Transaction error", error);
          toast({
            title: "Listing Failed",
            description:
              error?.message || "An error occurred while creating the listing.",
            variant: "destructive",
          });
          if (onError) onError(error);
        },
      });
    },
    [activeAccount, toast, updateListings]
  );

  /**
   * Buys an NFT from a listing
   * @param {string} listingId - Listing ID
   * @param {number} quantity - Quantity to buy
   * @param {string} pricePerToken - Price per token in wei
   * @returns {Function} - Transaction function for use with TransactionButton
   */
  const buyListing = useCallback(
    (listingId, quantity, pricePerToken) => {
      if (!activeAccount) return null;

      return (onSuccess, onError) => ({
        payModal: {
          buyWithFiat: false,
        },
        transaction: () => {
          return buyFromListing({
            contract: marketplaceV3Contract,
            listingId: listingId,
            quantity: BigInt(quantity),
            recipient: activeAccount.address,
          });
        },
        onTransactionSent: (result) => {
          console.log("Transaction sent", result);
          toast({
            title: "Purchase Initiated",
            description: "Your purchase is being processed.",
          });
          if (onSuccess) onSuccess(result);
        },
        onTransactionConfirmed: (receipt) => {
          console.log("Transaction confirmed", receipt);
          toast({
            title: "Purchase Successful",
            description: "You have successfully bought the NFT.",
          });
          updateListings();
        },
        onError: (error) => {
          console.error("Transaction error", error);
          toast({
            title: "Purchase Failed",
            description:
              error?.message || "An error occurred while purchasing the NFT.",
            variant: "destructive",
          });
          if (onError) onError(error);
        },
      });
    },
    [activeAccount, toast, updateListings]
  );

  /**
   * Cancels a listing
   * @param {string} listingId - Listing ID
   * @returns {Function} - Transaction function for use with TransactionButton
   */
  const cancelListing = useCallback(
    (listingId) => {
      if (!activeAccount) return null;

      return (onSuccess, onError) => ({
        transaction: () => {
          return prepareContractCall({
            contract: marketplaceV3Contract,
            method: "function cancelListing(uint256 _listingId)",
            params: [listingId.toString()],
          });
        },
        onTransactionSent: (result) => {
          console.log("Transaction sent", result);
          toast({
            title: "Cancellation Initiated",
            description: "Your listing cancellation is being processed.",
          });
          if (onSuccess) onSuccess(result);
        },
        onTransactionConfirmed: (receipt) => {
          console.log("Transaction confirmed", receipt);
          toast({
            title: "Listing Cancelled",
            description: "Your listing has been successfully cancelled.",
          });
          updateListings(); // Refresh listings after confirmation
        },
        onError: (error) => {
          console.error("Transaction error", error);
          toast({
            title: "Cancellation Failed",
            description:
              error?.message ||
              "An error occurred while cancelling the listing.",
            variant: "destructive",
          });
          if (onError) onError(error);
        },
      });
    },
    [activeAccount, toast, updateListings]
  );

  /**
   * Gets listings for a specific collection
   * @param {string} collectionAddress - Collection contract address
   * @returns {Array} - Array of listings for the collection
   */
  const getCollectionListings = useCallback(
    (collectionAddress) => {
      return listings.filter(
        (listing) =>
          listing.assetContract.toLowerCase() ===
          collectionAddress.toLowerCase()
      );
    },
    [listings]
  );

  /**
   * Gets a specific listing by ID
   * @param {string} listingId - Listing ID
   * @returns {Object|null} - Listing object or null if not found
   */
  const getListingById = useCallback(
    (listingId) => {
      return listings.find((listing) => listing.id === listingId) || null;
    },
    [listings]
  );

  // Context value
  const value = {
    listings,
    isLoading,
    totalListingsCount,
    lastUpdated,
    createListing,
    buyListing,
    cancelListing,
    updateListings,
    getCollectionListings,
    getListingById,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};
