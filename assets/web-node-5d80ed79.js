import{K as n,cz as u}from"./index-1ebb32ef.js";async function l(a,s,i,e){var r;const d={},t=await n(a)(`https://${u().storage}/ipfs/upload`,{method:"POST",headers:{...d},body:s});if(!t.ok)throw(r=t.body)==null||r.cancel(),t.status===401?new Error("Unauthorized - You don't have permission to use this service."):new Error(`Failed to upload files to IPFS - ${t.status} - ${t.statusText}`);const o=(await t.json()).IpfsHash;if(!o)throw new Error("Failed to upload files to IPFS - Bad CID");return e!=null&&e.uploadWithoutDirectory?[`ipfs://${o}`]:i.map(h=>`ipfs://${o}/${h}`)}export{l as uploadBatch};