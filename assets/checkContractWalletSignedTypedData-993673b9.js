import{i as r}from"./isValidSignature-10292966.js";import{z as a}from"./index-ec0f2259.js";import{h as e}from"./index-bc408b91.js";import"./send-eip712-transaction-c130e51a.js";import"./eth_sendRawTransaction-5ae15b91.js";import"./concat-hex-c9b9fd32.js";import"./sha256-5a6ea650.js";const i="0x1626ba7e";async function p(t){if(!a(t.signature))throw new Error("The signature must be a valid hex string.");return await r({contract:t.contract,hash:e(t.data),signature:t.signature})===i}export{p as checkContractWalletSignedTypedData};