import client from "../lib/client";
import { getContract } from "thirdweb";
import { base, baseSepolia } from "thirdweb/chains";
import BasedSnoutABI from "../abis/BasedSnout.json";
import BlockyBullsABI from "../abis/BlockyBulls.json";
import MarketplaceV3ABI from "../abis/MarketplaceV3ABI.json";
import ThirdwebNFTABI from "../abis/ThirdwebNFTABI.json";
import BBullVotingABI from "../abis/BBullVoting.json";

export const BASE_NETWORK = base;
export const BASE_SEPOLIA = baseSepolia;

export const BlockyBullsContractAddress =
  "0xd9D98A369BBAA3934304D6ACBf9013E33e2a3368";
export const blockyBullsContract = getContract({
  address: BlockyBullsContractAddress,
  abi: BlockyBullsABI,
  client,
  chain: base,
});

export const BasedSnoutContractAddress =
  "0xa4F353a0E294Ec6deB943DBD7F56a5c315B6f65b";
export const basedSnoutContract = getContract({
  address: BasedSnoutContractAddress,
  abi: BasedSnoutABI,
  client,
  chain: base,
});

export const BTBContractAddress = "0x50344910D047dAa13A164c991aeBe39aBA170ca5";
export const btbContract = getContract({
  address: BTBContractAddress,
  abi: ThirdwebNFTABI,
  client,
  chain: base,
});

export const HonoraryContractAddress =
  "0xd3aff8a8f31ce60c9e1b5221a22503ebba7f1688";
export const honoraryContract = getContract({
  address: HonoraryContractAddress,
  abi: ThirdwebNFTABI,
  client,
  chain: base,
});

export const MarketplaceV3ContractAddress =
  "0xdf93B6F633d1E4F956FBCf94ed56165B5c773Bf1";
export const marketplaceV3Contract = getContract({
  address: MarketplaceV3ContractAddress,
  abi: MarketplaceV3ABI,
  client,
  chain: base,
});

export const simplePollContractAddress =
  "0x31d7b64631e6B225a703E5a5457f0FB29aE365eE";
export const simplePollContract = getContract({
  address: simplePollContractAddress,
  abi: BBullVotingABI,
  client,
  chain: base,
});
