import{b$ as c,K as n,a5 as o,aG as d}from"./index-d8b6f218.js";import{v as u}from"./session-request-2d08de20.js";async function h(e){const{account:t,chainId:s,thirdwebClient:i,params:[a]}=e;a.from!==void 0&&u(t,a.from);const r=c({gas:a.gas?n(a.gas):void 0,gasPrice:a.gasPrice?n(a.gasPrice):void 0,value:a.value?n(a.value):void 0,to:a.to,data:a.data,chain:o(s),client:i});return(await d({transaction:r,account:t})).transactionHash}export{h as handleSendTransactionRequest};