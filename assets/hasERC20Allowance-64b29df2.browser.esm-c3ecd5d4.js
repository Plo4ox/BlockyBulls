import{v as l,a as w}from"./index-873c6c8c.js";async function g(e,a,t){const r=e.getProvider(),n=(await l(()=>import("./index-873c6c8c.js").then(d=>d.eo),["./index-873c6c8c.js","./index-1c37be55.css"],import.meta.url)).default,s=new w(r,a,n,{},e.storage),o=await e.getSignerAddress(),i=e.address;return(await s.read("allowance",[o,i])).gte(t)}export{g as h};