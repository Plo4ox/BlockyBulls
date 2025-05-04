import React from "react";
import { Link } from "react-router-dom";

/**
 * Component for displaying an Ethereum address as a formatted link
 * Can link to external block explorer or to internal account page
 *
 * @param {Object} props - Component props
 * @param {string} props.address - The Ethereum address to display
 * @param {string} props.name - Optional resolved name (ENS, etc.)
 * @param {boolean} props.useAccountPage - Whether to link to internal account page
 * @param {string} props.explorerUrl - Optional custom block explorer URL
 * @param {string} props.className - Optional additional CSS classes
 * @param {string} props.truncateLength - Optional custom truncation length
 */
const FormattedAddressLink = ({
  address,
  name,
  useAccountPage = false,
  explorerUrl = "https://basescan.org/address/",
  className = "text-blue-500 hover:underline",
  truncateLength = 6,
}) => {
  // Format address for display if no name is provided
  const formatAddress = (addr) => {
    if (!addr || addr.length <= truncateLength * 2) return addr;
    return `${addr.slice(0, truncateLength)}...${addr.slice(-4)}`;
  };

  // Display text is the name (if provided) or the formatted address
  const displayText = name || formatAddress(address);

  // When using internal account page
  if (useAccountPage) {
    return (
      <Link to={`/account/${address}`} className={className}>
        {displayText}
      </Link>
    );
  }

  // When using external block explorer
  return (
    <a
      href={`${explorerUrl}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {displayText}
    </a>
  );
};

export default FormattedAddressLink;
