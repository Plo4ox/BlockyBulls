import{i as s}from"./isValidSignature-083bfb28.js";import{cw as a,aw as i,r as c,t as u,d as o}from"./index-1ebb32ef.js";const g=`Ethereum Signed Message:
`;function f(t,r){const e=(()=>typeof t=="string"?a(t):t.raw instanceof Uint8Array?t.raw:i(t.raw))(),n=a(`${g}${e.length}`);return c(u([n,e]),r)}const h="0x1626ba7e";async function x(t){if(!o(t.signature))throw new Error("The signature must be a valid hex string.");return await s({contract:t.contract,hash:f(t.message),signature:t.signature})===h}export{x as checkContractWalletSignature};