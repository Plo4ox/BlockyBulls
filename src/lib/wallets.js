import { createWallet, walletConnect } from "thirdweb/wallets";

export const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  walletConnect(),
];
