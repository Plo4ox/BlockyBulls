import{N as r,bM as n}from"./index-1ebb32ef.js";import{getCurrencyMetadata as c}from"./getCurrencyMetadata-3b0ae2fd.js";import"./symbol-66178518.js";import"./decimals-7882d418.js";const s="0x70a08231",o=[{type:"address",name:"_address"}],d=[{type:"uint256"}];async function m(a){return r({contract:a.contract,method:[s,o,d],params:[a.address]})}async function y(a){const[t,e]=await Promise.all([m(a),c(a)]);return{...e,value:t,displayValue:n(t,e.decimals)}}export{y as getBalance};