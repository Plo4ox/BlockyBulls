import{v as n}from"./session-request-d2fa134d.js";import"./index-a46b0fa2.js";async function o(e){const{account:s,params:a}=e;return n(s,a[1]),s.signMessage({message:{raw:a[0]}})}export{o as handleSignRequest};