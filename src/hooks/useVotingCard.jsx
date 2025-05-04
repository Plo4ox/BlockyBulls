import { useReadContract } from "thirdweb/react";
import { VotingCardQuery, VotingCardFactory } from "../consts/contracts";

export function useVotingCard(cardAddress) {
  // Get minting requirements for a specific voting card
  const { data: requirements, isLoading: requirementsLoading } =
    useReadContract({
      contract: VotingCardQuery,
      method: "getMintingRequirements",
      params: [cardAddress],
    });

  // Check if user has the voting card
  const { data: balance, isLoading: balanceLoading } = useReadContract({
    contract: cardAddress,
    method: "balanceOf",
    params: [activeAccount?.address],
  });

  // Check if user can mint the card
  const canMint = async () => {
    if (!requirements) return false;

    // If there's a token gate, check balance
    if (
      requirements.tokenGate !== "0x0000000000000000000000000000000000000000"
    ) {
      const tokenBalance = await readContract({
        contract: requirements.tokenGate,
        method: "balanceOf",
        params: [activeAccount.address],
      });

      return tokenBalance >= requirements.tokenAmount;
    }

    // If whitelist only, check whitelist status
    return requirements.isWhitelisted;
  };

  return {
    hasCard: balance > 0,
    canMint,
    requirements,
    isLoading: requirementsLoading || balanceLoading,
  };
}
