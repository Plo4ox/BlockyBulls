import{v as n}from"./session-request-d2fa134d.js";import"./index-a46b0fa2.js";async function o(e){const{account:a,params:t}=e;return n(a,t[0]),a.signTypedData(typeof t[1]=="string"?JSON.parse(t[1]):t[1])}export{o as handleSignTypedDataRequest};