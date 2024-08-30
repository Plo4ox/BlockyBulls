import{cH as e,cI as a,a0 as i,w as o}from"./index-883b95b7.js";const c=`Ethereum Signed Message:
`;function u(t,n){const r=(()=>typeof t=="string"?e(t):t.raw instanceof Uint8Array?t.raw:a(t.raw))(),s=e(`${c}${r.length}`);return i(o([s,r]),n)}export{u as hashMessage};
