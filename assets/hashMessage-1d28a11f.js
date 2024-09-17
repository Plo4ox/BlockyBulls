import{cj as e,ck as a,a8 as i,C as o}from"./index-0edb69aa.js";const c=`Ethereum Signed Message:
`;function u(t,n){const r=(()=>typeof t=="string"?e(t):t.raw instanceof Uint8Array?t.raw:a(t.raw))(),s=e(`${c}${r.length}`);return i(o([s,r]),n)}export{u as hashMessage};
