import{cH as d,a1 as n}from"./index-d8b6f218.js";function T(o,r){if(d(o.address)!==d(r))throw new Error(`Failed to validate account address (${o.address}), differs from ${r}`)}function m(o){const r=o.split(":"),p=Number.parseInt(r[1]??"0");if(r.length!==2||r[0]!=="eip155"||p===0||!p)throw new Error(`Invalid chainId ${o}, should have the format 'eip155:1'`);return p}async function u(o){const{wallet:r,walletConnectClient:p,thirdwebClient:w,event:{topic:h,id:l,params:{chainId:c,request:t}},handlers:a}=o,i=r.getAccount();if(!i)throw new Error("No account connected to provided wallet");let s;try{switch(t.method){case"personal_sign":{if(a!=null&&a.personal_sign)s=await a.personal_sign({account:i,params:t.params});else{const{handleSignRequest:e}=await n(()=>import("./sign-0809a7c2.js"),["assets/sign-0809a7c2.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({account:i,params:t.params})}break}case"eth_sign":{if(a!=null&&a.eth_sign)s=await a.eth_sign({account:i,params:t.params});else{const{handleSignRequest:e}=await n(()=>import("./sign-0809a7c2.js"),["assets/sign-0809a7c2.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({account:i,params:t.params})}break}case"eth_signTypedData":{if(a!=null&&a.eth_signTypedData)s=await a.eth_signTypedData({account:i,params:t.params});else{const{handleSignTypedDataRequest:e}=await n(()=>import("./sign-typed-data-52f9b85e.js"),["assets/sign-typed-data-52f9b85e.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({account:i,params:t.params})}break}case"eth_signTypedData_v4":{if(a!=null&&a.eth_signTypedData_v4)s=await a.eth_signTypedData_v4({account:i,params:t.params});else{const{handleSignTypedDataRequest:e}=await n(()=>import("./sign-typed-data-52f9b85e.js"),["assets/sign-typed-data-52f9b85e.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({account:i,params:t.params})}break}case"eth_signTransaction":{if(a!=null&&a.eth_signTransaction)s=await a.eth_signTransaction({account:i,params:t.params});else{const{handleSignTransactionRequest:e}=await n(()=>import("./sign-transaction-3254ee55.js"),["assets/sign-transaction-3254ee55.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({account:i,params:t.params})}break}case"eth_sendTransaction":{const e=m(c);if(a!=null&&a.eth_sendTransaction)s=await a.eth_sendTransaction({account:i,chainId:e,params:t.params});else{const{handleSendTransactionRequest:_}=await n(()=>import("./send-transaction-8ad159af.js"),["assets/send-transaction-8ad159af.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await _({account:i,chainId:e,thirdwebClient:w,params:t.params})}break}case"eth_sendRawTransaction":{const e=m(c);if(a!=null&&a.eth_sendRawTransaction)s=await a.eth_sendRawTransaction({account:i,chainId:e,params:t.params});else{const{handleSendRawTransactionRequest:_}=await n(()=>import("./send-raw-transaction-1614d7ec.js"),[]);s=await _({account:i,chainId:e,params:t.params})}break}case"wallet_addEthereumChain":{if(a!=null&&a.wallet_addEthereumChain)s=await a.wallet_addEthereumChain({wallet:r,params:t.params});else throw new Error("Unsupported request method: wallet_addEthereumChain");break}case"wallet_switchEthereumChain":{if(a!=null&&a.wallet_switchEthereumChain)s=await a.wallet_switchEthereumChain({wallet:r,params:t.params});else{const{handleSwitchChain:e}=await n(()=>import("./switch-chain-c3492938.js"),["assets/switch-chain-c3492938.js","assets/index-d8b6f218.js","assets/index-2ed5f339.css"]);s=await e({wallet:r,params:t.params})}break}default:{const e=a==null?void 0:a[t.method];if(e)s=await e({account:i,chainId:m(c),params:t.params});else throw new Error(`Unsupported request method: ${t.method}`)}}}catch(e){s={code:typeof e=="object"&&e!==null&&"code"in e?e.code:500,message:typeof e=="object"&&e!==null&&"message"in e?e.message:"Unknown error"}}p.respond({topic:h,response:{id:l,jsonrpc:"2.0",result:s}})}const f=Object.freeze(Object.defineProperty({__proto__:null,fulfillRequest:u},Symbol.toStringTag,{value:"Module"}));export{f as s,T as v};