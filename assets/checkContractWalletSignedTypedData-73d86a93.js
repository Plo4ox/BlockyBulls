import{i as r}from"./isValidSignature-ed5dc200.js";import{z as a}from"./index-a46b0fa2.js";import{h as e}from"./index-6114a37b.js";import"./send-eip712-transaction-ef2a5ae6.js";import"./eth_sendRawTransaction-5ae15b91.js";import"./concat-hex-c9b9fd32.js";import"./sha256-82dcbad3.js";const i="0x1626ba7e";async function p(t){if(!a(t.signature))throw new Error("The signature must be a valid hex string.");return await r({contract:t.contract,hash:e(t.data),signature:t.signature})===i}export{p as checkContractWalletSignedTypedData};