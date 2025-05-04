import { useState, useEffect } from "react";

const useEthPrice = ({
  cacheDuration = 5 * 60 * 1000,
  cacheKey = "ethPriceData",
} = {}) => {
  const [ethPrice, setEthPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        // Check if we have a cached price
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const { price, timestamp } = JSON.parse(cachedData);

          // Use cached price if it's recent enough
          if (Date.now() - timestamp < cacheDuration) {
            setEthPrice(price);
            setLoading(false);
            return;
          }
        }

        // Fetch new price from API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch ETH price: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        const newPrice = data.ethereum.usd;

        // Update state and cache
        setEthPrice(newPrice);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            price: newPrice,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.error("Error fetching ETH price:", err);
        setError(err);

        // Try to use cached price even if expired in case of error
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { price } = JSON.parse(cachedData);
          setEthPrice(price);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEthPrice();

    // Set up an interval to refresh the price periodically
    const intervalId = setInterval(fetchEthPrice, cacheDuration);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [cacheDuration, cacheKey]);

  return { ethPrice, loading, error };
};

export default useEthPrice;
