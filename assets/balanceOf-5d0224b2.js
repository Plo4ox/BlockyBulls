import{d as r,e as c,a as o,r as d}from"./index-ec0f2259.js";const n="0x00fdd58e",t=[{type:"address",name:"_owner"},{type:"uint256",name:"tokenId"}],a=[{type:"uint256"}];function f(e){return r({availableSelectors:e,method:[n,t,a]})}function s(e){return c(t,[e.owner,e.tokenId])}function m(e){return n+s(e).slice(2)}function i(e){return o(a,e)[0]}async function l(e){return d({contract:e.contract,method:[n,t,a],params:[e.owner,e.tokenId]})}export{n as FN_SELECTOR,l as balanceOf,i as decodeBalanceOfResult,m as encodeBalanceOf,s as encodeBalanceOfParams,f as isBalanceOfSupported};