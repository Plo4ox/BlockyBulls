import{B as d,cp as W,cq as P,cr as T,cs as ne,ct as G,cu as _,cv as ie,cw as re,cx as oe,cy as p,aD as ae,aH as ce,y as h,H as N,cz as fe,cA as le,ab as F,ac as L,af as C,cB as M,a3 as he,cC as ue,Q as be}from"./index-67021abe.js";class $ extends d{constructor({chainId:e}){super(typeof e=="number"?`Chain ID "${e}" is invalid.`:"Chain ID is invalid."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidChainIdError"})}}const de={ether:-9,wei:9};function xe(t,e){let s=t.toString();const i=s.startsWith("-");i&&(s=s.slice(1)),s=s.padStart(e,"0");let[n,r]=[s.slice(0,s.length-e),s.slice(s.length-e)];return r=r.replace(/(0+)$/,""),`${i?"-":""}${n||"0"}${r?`.${r}`:""}`}function H(t,e="wei"){return xe(t,de[e])}function pe(t){const e=Object.entries(t).map(([i,n])=>n===void 0||n===!1?null:[i,n]).filter(Boolean),s=e.reduce((i,[n])=>Math.max(i,n.length),0);return e.map(([i,n])=>`  ${`${i}:`.padEnd(s+1)}  ${n}`).join(`
`)}class ge extends d{constructor({v:e}){super(`Invalid \`v\` value "${e}". Expected 27 or 28.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidLegacyVError"})}}class ye extends d{constructor({transaction:e}){super("Cannot infer a transaction type from provided transaction.",{metaMessages:["Provided Transaction:","{",pe(e),"}","","To infer the type, either provide:","- a `type` to the Transaction, or","- an EIP-1559 Transaction with `maxFeePerGas`, or","- an EIP-2930 Transaction with `gasPrice` & `accessList`, or","- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or","- a Legacy Transaction with `gasPrice`"]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidSerializableTransactionError"})}}class me extends d{constructor({storageKey:e}){super(`Size for storage key "${e}" is invalid. Expected 32 bytes. Got ${Math.floor((e.length-2)/2)} bytes.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidStorageKeySizeError"})}}class A extends d{constructor({cause:e,maxFeePerGas:s}={}){super(`The fee cap (\`maxFeePerGas\`${s?` = ${H(s)} gwei`:""}) cannot be higher than the maximum allowed value (2^256-1).`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"FeeCapTooHigh"})}}Object.defineProperty(A,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/});class R extends d{constructor({cause:e,maxPriorityFeePerGas:s,maxFeePerGas:i}={}){super([`The provided tip (\`maxPriorityFeePerGas\`${s?` = ${H(s)} gwei`:""}) cannot be higher than the fee cap (\`maxFeePerGas\`${i?` = ${H(i)} gwei`:""}).`].join(`
`),{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TipAboveFeeCapError"})}}Object.defineProperty(R,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max priority fee per gas higher than max fee per gas|tip higher than fee cap/});function E(t,e="hex"){const s=q(t),i=W(new Uint8Array(s.length));return s.encode(i),e==="hex"?P(i.bytes):i.bytes}function q(t){return Array.isArray(t)?we(t.map(e=>q(e))):Pe(t)}function we(t){const e=t.reduce((n,r)=>n+r.length,0),s=Q(e);return{length:(()=>e<=55?1+e:1+s+e)(),encode(n){e<=55?n.pushByte(192+e):(n.pushByte(192+55+s),s===1?n.pushUint8(e):s===2?n.pushUint16(e):s===3?n.pushUint24(e):n.pushUint32(e));for(const{encode:r}of t)r(n)}}}function Pe(t){const e=typeof t=="string"?T(t):t,s=Q(e.length);return{length:(()=>e.length===1&&e[0]<128?1:e.length<=55?1+e.length:1+s+e.length)(),encode(n){e.length===1&&e[0]<128?n.pushBytes(e):e.length<=55?(n.pushByte(128+e.length),n.pushBytes(e)):(n.pushByte(128+55+s),s===1?n.pushUint8(e.length):s===2?n.pushUint16(e.length):s===3?n.pushUint24(e.length):n.pushUint32(e.length),n.pushBytes(e))}}}function Q(t){if(t<2**8)return 1;if(t<2**16)return 2;if(t<2**24)return 3;if(t<2**32)return 4;throw new d("Length is too large.")}function ve(t,e,s,i){if(typeof t.setBigUint64=="function")return t.setBigUint64(e,s,i);const n=BigInt(32),r=BigInt(4294967295),o=Number(s>>n&r),a=Number(s&r),c=i?4:0,l=i?0:4;t.setUint32(e+c,o,i),t.setUint32(e+l,a,i)}class ze extends ne{constructor(e,s,i,n){super(),this.blockLen=e,this.outputLen=s,this.padOffset=i,this.isLE=n,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(e),this.view=G(this.buffer)}update(e){_(this);const{view:s,buffer:i,blockLen:n}=this;e=ie(e);const r=e.length;for(let o=0;o<r;){const a=Math.min(n-this.pos,r-o);if(a===n){const c=G(e);for(;n<=r-o;o+=n)this.process(c,o);continue}i.set(e.subarray(o,o+a),this.pos),this.pos+=a,o+=a,this.pos===n&&(this.process(s,0),this.pos=0)}return this.length+=e.length,this.roundClean(),this}digestInto(e){_(this),re(e,this),this.finished=!0;const{buffer:s,view:i,blockLen:n,isLE:r}=this;let{pos:o}=this;s[o++]=128,this.buffer.subarray(o).fill(0),this.padOffset>n-o&&(this.process(i,0),o=0);for(let f=o;f<n;f++)s[f]=0;ve(i,n-8,BigInt(this.length*8),r),this.process(i,0);const a=G(e),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen should be aligned to 32bit");const l=c/4,u=this.get();if(l>u.length)throw new Error("_sha2: outputLen bigger than state");for(let f=0;f<l;f++)a.setUint32(4*f,u[f],r)}digest(){const{buffer:e,outputLen:s}=this;this.digestInto(e);const i=e.slice(0,s);return this.destroy(),i}_cloneInto(e){e||(e=new this.constructor),e.set(...this.get());const{blockLen:s,buffer:i,length:n,finished:r,destroyed:o,pos:a}=this;return e.length=n,e.pos=a,e.finished=r,e.destroyed=o,n%s&&e.buffer.set(i),e}}const Te=(t,e,s)=>t&e^~t&s,Ee=(t,e,s)=>t&e^t&s^e&s,Be=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),g=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),y=new Uint32Array(64);class Ie extends ze{constructor(){super(64,32,8,!1),this.A=g[0]|0,this.B=g[1]|0,this.C=g[2]|0,this.D=g[3]|0,this.E=g[4]|0,this.F=g[5]|0,this.G=g[6]|0,this.H=g[7]|0}get(){const{A:e,B:s,C:i,D:n,E:r,F:o,G:a,H:c}=this;return[e,s,i,n,r,o,a,c]}set(e,s,i,n,r,o,a,c){this.A=e|0,this.B=s|0,this.C=i|0,this.D=n|0,this.E=r|0,this.F=o|0,this.G=a|0,this.H=c|0}process(e,s){for(let f=0;f<16;f++,s+=4)y[f]=e.getUint32(s,!1);for(let f=16;f<64;f++){const x=y[f-15],b=y[f-2],B=p(x,7)^p(x,18)^x>>>3,w=p(b,17)^p(b,19)^b>>>10;y[f]=w+y[f-7]+B+y[f-16]|0}let{A:i,B:n,C:r,D:o,E:a,F:c,G:l,H:u}=this;for(let f=0;f<64;f++){const x=p(a,6)^p(a,11)^p(a,25),b=u+x+Te(a,c,l)+Be[f]+y[f]|0,w=(p(i,2)^p(i,13)^p(i,22))+Ee(i,n,r)|0;u=l,l=c,c=a,a=o+b|0,o=r,r=n,n=i,i=b+w|0}i=i+this.A|0,n=n+this.B|0,r=r+this.C|0,o=o+this.D|0,a=a+this.E|0,c=c+this.F|0,l=l+this.G|0,u=u+this.H|0,this.set(i,n,r,o,a,c,l,u)}roundClean(){y.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}}const Fe=oe(()=>new Ie);function Le(t,e){const s=e||"hex",i=Fe(ae(t,{strict:!1})?ce(t):t);return s==="bytes"?i:h(i)}function Ae(t){if(t.type)return t.type;if(typeof t.blobs<"u"||typeof t.blobVersionedHashes<"u"||typeof t.maxFeePerBlobGas<"u"||typeof t.sidecars<"u")return"eip4844";if(typeof t.maxFeePerGas<"u"||typeof t.maxPriorityFeePerGas<"u")return"eip1559";if(typeof t.gasPrice<"u")return typeof t.accessList<"u"?"eip2930":"legacy";throw new ye({transaction:t})}const Y=1;class Ge extends d{constructor({maxSize:e,size:s}){super("Blob size is too large.",{metaMessages:[`Max: ${e} bytes`,`Given: ${s} bytes`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BlobSizeTooLargeError"})}}class J extends d{constructor(){super("Blob data must not be empty."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EmptyBlobError"})}}class He extends d{constructor({hash:e,size:s}){super(`Versioned hash "${e}" size is invalid.`,{metaMessages:["Expected: 32",`Received: ${s}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidVersionedHashSizeError"})}}class Ce extends d{constructor({hash:e,version:s}){super(`Versioned hash "${e}" version is invalid.`,{metaMessages:[`Expected: ${Y}`,`Received: ${s}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidVersionedHashVersionError"})}}function $e(t){const{blobVersionedHashes:e}=t;if(e){if(e.length===0)throw new J;for(const s of e){const i=N(s),n=fe(le(s,0,1));if(i!==32)throw new He({hash:s,size:i});if(n!==Y)throw new Ce({hash:s,version:n})}}X(t)}function X(t){const{chainId:e,maxPriorityFeePerGas:s,maxFeePerGas:i,to:n}=t;if(e<=0)throw new $({chainId:e});if(n&&!F(n))throw new L({address:n});if(i&&i>2n**256n-1n)throw new A({maxFeePerGas:i});if(s&&i&&s>i)throw new R({maxFeePerGas:i,maxPriorityFeePerGas:s})}function Ue(t){const{chainId:e,maxPriorityFeePerGas:s,gasPrice:i,maxFeePerGas:n,to:r}=t;if(e<=0)throw new $({chainId:e});if(r&&!F(r))throw new L({address:r});if(s||n)throw new d("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");if(i&&i>2n**256n-1n)throw new A({maxFeePerGas:i})}function Se(t){const{chainId:e,maxPriorityFeePerGas:s,gasPrice:i,maxFeePerGas:n,to:r,accessList:o}=t;if(r&&!F(r))throw new L({address:r});if(typeof e<"u"&&e<=0)throw new $({chainId:e});if(s||n)throw new d("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");if(i&&i>2n**256n-1n)throw new A({maxFeePerGas:i});if(o)throw new d("`accessList` is not a valid Legacy Transaction attribute.")}function Z(t){const{kzg:e}=t,s=t.to??(typeof t.blobs[0]=="string"?"hex":"bytes"),i=typeof t.blobs[0]=="string"?t.blobs.map(r=>T(r)):t.blobs,n=[];for(const r of i)n.push(Uint8Array.from(e.blobToKzgCommitment(r)));return s==="bytes"?n:n.map(r=>P(r))}function ee(t){const{kzg:e}=t,s=t.to??(typeof t.blobs[0]=="string"?"hex":"bytes"),i=typeof t.blobs[0]=="string"?t.blobs.map(o=>T(o)):t.blobs,n=typeof t.commitments[0]=="string"?t.commitments.map(o=>T(o)):t.commitments,r=[];for(let o=0;o<i.length;o++){const a=i[o],c=n[o];r.push(Uint8Array.from(e.computeBlobKzgProof(a,c)))}return s==="bytes"?r:r.map(o=>P(o))}const D=6,te=32,U=4096,se=te*U,K=se*D-1-1*U*D;function Ve(t){const e=t.to??(typeof t.data=="string"?"hex":"bytes"),s=typeof t.data=="string"?T(t.data):t.data,i=N(s);if(!i)throw new J;if(i>K)throw new Ge({maxSize:K,size:i});const n=[];let r=!0,o=0;for(;r;){const a=W(new Uint8Array(se));let c=0;for(;c<U;){const l=s.slice(o,o+(te-1));if(a.pushByte(0),a.pushBytes(l),l.length<31){a.pushByte(128),r=!1;break}c++,o+=31}n.push(a)}return e==="bytes"?n.map(a=>a.bytes):n.map(a=>P(a.bytes))}function je(t){const{data:e,kzg:s,to:i}=t,n=t.blobs??Ve({data:e,to:i}),r=t.commitments??Z({blobs:n,kzg:s,to:i}),o=t.proofs??ee({blobs:n,commitments:r,kzg:s,to:i}),a=[];for(let c=0;c<n.length;c++)a.push({blob:n[c],commitment:r[c],proof:o[c]});return a}function Oe(t){const{commitment:e,version:s=1}=t,i=t.to??(typeof e=="string"?"hex":"bytes"),n=Le(e,"bytes");return n.set([s],0),i==="bytes"?n:P(n)}function ke(t){const{commitments:e,version:s}=t,i=t.to??(typeof e[0]=="string"?"hex":"bytes"),n=[];for(const r of e)n.push(Oe({commitment:r,to:i,version:s}));return n}function S(t){if(!t||t.length===0)return[];const e=[];for(let s=0;s<t.length;s++){const{address:i,storageKeys:n}=t[s];for(let r=0;r<n.length;r++)if(n[r].length-2!==64)throw new me({storageKey:n[r]});if(!F(i,{strict:!1}))throw new L({address:i});e.push([i,n])}return e}function _e(t,e){const s=Ae(t);return s==="eip1559"?De(t,e):s==="eip2930"?Ke(t,e):s==="eip4844"?Me(t,e):We(t,e)}function Me(t,e){const{chainId:s,gas:i,nonce:n,to:r,value:o,maxFeePerBlobGas:a,maxFeePerGas:c,maxPriorityFeePerGas:l,accessList:u,data:f}=t;$e(t);let x=t.blobVersionedHashes,b=t.sidecars;if(t.blobs&&(typeof x>"u"||typeof b>"u")){const m=typeof t.blobs[0]=="string"?t.blobs:t.blobs.map(z=>P(z)),I=t.kzg,v=Z({blobs:m,kzg:I});if(typeof x>"u"&&(x=ke({commitments:v})),typeof b>"u"){const z=ee({blobs:m,commitments:v,kzg:I});b=je({blobs:m,commitments:v,proofs:z})}}const B=S(u),w=[h(s),n?h(n):"0x",l?h(l):"0x",c?h(c):"0x",i?h(i):"0x",r??"0x",o?h(o):"0x",f??"0x",B,a?h(a):"0x",x??[],...V(t,e)],j=[],O=[],k=[];if(b)for(let m=0;m<b.length;m++){const{blob:I,commitment:v,proof:z}=b[m];j.push(I),O.push(v),k.push(z)}return C(["0x03",E(b?[w,j,O,k]:w)])}function De(t,e){const{chainId:s,gas:i,nonce:n,to:r,value:o,maxFeePerGas:a,maxPriorityFeePerGas:c,accessList:l,data:u}=t;X(t);const f=S(l),x=[h(s),n?h(n):"0x",c?h(c):"0x",a?h(a):"0x",i?h(i):"0x",r??"0x",o?h(o):"0x",u??"0x",f,...V(t,e)];return C(["0x02",E(x)])}function Ke(t,e){const{chainId:s,gas:i,data:n,nonce:r,to:o,value:a,accessList:c,gasPrice:l}=t;Ue(t);const u=S(c),f=[h(s),r?h(r):"0x",l?h(l):"0x",i?h(i):"0x",o??"0x",a?h(a):"0x",n??"0x",u,...V(t,e)];return C(["0x01",E(f)])}function We(t,e){const{chainId:s=0,gas:i,data:n,nonce:r,to:o,value:a,gasPrice:c}=t;Se(t);let l=[r?h(r):"0x",c?h(c):"0x",i?h(i):"0x",o??"0x",a?h(a):"0x",n??"0x"];if(e){const u=(()=>{if(e.v>=35n)return(e.v-35n)/2n>0?e.v:27n+(e.v===35n?0n:1n);if(s>0)return BigInt(s*2)+BigInt(35n+e.v-27n);const f=27n+(e.v===27n?0n:1n);if(e.v!==f)throw new ge({v:e.v});return f})();l=[...l,h(u),e.r,e.s]}else s>0&&(l=[...l,h(s),"0x","0x"]);return E(l)}function V(t,e){const{r:s,s:i,v:n,yParity:r}=e??t;return typeof s>"u"?[]:typeof i>"u"?[]:typeof n>"u"&&typeof r>"u"?[]:[(()=>typeof r=="number"?r?h(1):"0x":n===0n?"0x":n===1n?h(1):n===27n?"0x":h(1))(),M(s),M(i)]}const Ne="0x420000000000000000000000000000000000000F";async function qe(t){const{transaction:e,gasPriceOracleAddress:s}=t,i=he({client:e.client,address:s||Ne,chain:e.chain}),{gasPrice:n,...r}=await ue({transaction:e}),o=_e({...r,type:"eip1559"});return be({contract:i,method:"function getL1Fee(bytes memory _data) view returns (uint256)",params:[o]})}export{qe as estimateL1Fee};