import{cy as m,ai as d,al as b,_ as u}from"./index-1ebb32ef.js";import{getContractMetadata as A}from"./getContractMetadata-d0fcda44.js";import{h,M as L,c as p}from"./erc721-cb18c2a5.js";import"./parseNft-20a59f34.js";import"./uint8-array-0bc57be6.js";import"./symbol-66178518.js";import"./getNFT-c54ba72d.js";import"./ownerOf-2c905bcf.js";import"./upload-220b1431.js";import"./regex-88e9c765.js";import"./prepare-event-b3befdde.js";async function V(a){const{contract:t,merkleRoot:y,claimer:o}=a,s=((await A({contract:t})).merkle||{})[y];if(!s)return null;const n=await(await m({client:t.client,uri:s})).json(),D=o.slice(2,2+n.shardNybbles).toLowerCase(),k=n.baseUri.endsWith("/")?n.baseUri:`${n.baseUri}/`;let i;try{const e=`${k}${D}.json`;i=await(await m({client:t.client,uri:e})).json()}catch{return null}const w=await Promise.all(i.entries.map(async e=>h({entry:e,chain:t.chain,client:t.client,tokenDecimals:a.tokenDecimals}))),f=new L(w),r=i.entries.find(e=>e.address.toLowerCase()===o.toLowerCase());if(!r)return null;const _=f.getHexProof(await h({entry:r,chain:t.chain,client:t.client,tokenDecimals:a.tokenDecimals})).concat(i.proofs),c=r.currencyAddress||d,C=await(async()=>{if(b(c)||c===d)return 18;const[{getContract:e},{decimals:l}]=await Promise.all([u(()=>import("./index-1ebb32ef.js").then(E=>E.cC),["./index-1ebb32ef.js","./index-b446a0d4.css"],import.meta.url),u(()=>import("./decimals-27e98ea1.js"),["./decimals-27e98ea1.js","./index-1ebb32ef.js","./index-b446a0d4.css","./decimals-7882d418.js"],import.meta.url)]),P=e({address:c,chain:t.chain,client:t.client});return await l({contract:P})})();return{proof:_,quantityLimitPerWallet:p({quantity:r.maxClaimable||"unlimited",tokenDecimals:a.tokenDecimals}),pricePerToken:p({quantity:r.price||"unlimited",tokenDecimals:C}),currency:c}}export{V as fetchProofsForClaimer};