import{aB as h,ay as Y,_ as y,aC as t,aJ as g,bY as Z,aI as L,bZ as ee,aQ as K,aK as P,b_ as te,bk as ne,aE as oe,b$ as ae,aG as j,aX as k,aR as H,c0 as ie,c1 as se,c2 as re,bF as T,bQ as le,aN as w,c3 as V,c4 as ce,c5 as _,c6 as de,c7 as ue,c8 as me,aW as he,aT as ge,bV as pe,bP as fe,a$ as xe,c9 as ye,ca as we}from"./index-1ebb32ef.js";function be({countryCode:e,setCountryCode:n}){const s=h.useRef(null),{data:o}=Y({queryKey:["supported-sms-countries"],queryFn:async()=>{const{supportedSmsCountries:i}=await y(()=>import("./supported-sms-countries-9b9fdfc6.js"),[],import.meta.url);return i}}),u=o??[{countryIsoCode:"US",countryName:"United States",phoneNumberCode:1}];return t.jsx(t.Fragment,{children:t.jsxs(Se,{ref:s,name:"countries",id:"countries",value:e,onChange:i=>{n(i.target.value)},style:{paddingLeft:g.md,paddingRight:"0"},children:[t.jsx(N,{style:{display:"none"},value:e,children:e}),u.map(i=>t.jsxs(N,{value:`${i.countryIsoCode} +${i.phoneNumberCode}`,children:[i.countryName," +",i.phoneNumberCode," "]},i.countryIsoCode))]})})}const N=Z(()=>{const e=L();return{color:e.colors.primaryText,background:e.colors.modalBg,transition:"background 0.3s ease","&:hover":{background:e.colors.tertiaryBg}}}),Se=ee(()=>{const e=L();return{fontSize:K.sm,display:"block",padding:g.sm,boxSizing:"border-box",outline:"none",border:"none",borderRadius:P.lg,color:e.colors.primaryText,WebkitAppearance:"none",appearance:"none",cursor:"pointer",background:"transparent","&::placeholder":{color:e.colors.secondaryText},"&[disabled]":{cursor:"not-allowed"},minWidth:"0px",maxWidth:"90px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"}});function G(e){const[n,s]=h.useState("US +1"),[o,u]=h.useState(""),[i,l]=h.useState(),[c,v]=h.useState(!1),b=()=>{v(!0),!(!o||i)&&e.onSelect(e.format==="phone"?`+${n.split("+")[1]}${o}`:o)},r=c&&!!i||!o&&!!e.emptyErrorMessage&&c;return t.jsxs("div",{style:{width:"100%"},children:[t.jsxs(te,{style:{position:"relative",display:"flex",flexDirection:"row"},"data-error":r,children:[e.format==="phone"&&t.jsx(be,{countryCode:n,setCountryCode:s}),t.jsx(ne,{tabIndex:-1,placeholder:e.placeholder,style:{flexGrow:1,padding:`${g.md} ${e.format==="phone"?0:g.md}`},variant:"transparent",type:e.type,name:e.name,value:o,onChange:m=>{u(m.target.value),e.errorMessage?l(e.errorMessage(m.target.value)):l(void 0)},onKeyDown:m=>{m.key==="Enter"&&b()}}),t.jsx(oe,{onClick:b,style:{padding:g.md,borderRadius:`0 ${P.lg} ${P.lg} 0`},children:t.jsx(ae,{width:j.md,height:j.md})})]}),c&&i&&t.jsxs(t.Fragment,{children:[t.jsx(k,{y:"xs"}),t.jsx(H,{color:"danger",size:"sm",children:i})]}),!(c&&i)&&!o&&e.emptyErrorMessage&&c&&t.jsxs(t.Fragment,{children:[t.jsx(k,{y:"xs"}),t.jsx(H,{color:"danger",size:"sm",children:e.emptyErrorMessage})]})]})}function Ie(e){switch(e){case"google":return"Sign In - Google Accounts";default:return`Sign In - ${e.slice(0,1).toUpperCase()}${e.slice(1)}`}}function je(e){switch(e){case"facebook":return{width:715,height:555};default:return{width:350,height:500}}}function ke(e,n){const{height:s,width:o}=je(e),u=(window.innerHeight-s)/2,i=(window.innerWidth-o)/2,l=window.open("",void 0,`width=${o}, height=${s}, top=${u}, left=${i}`);if(l){const c=Ie(e);l.document.title=c,l.document.body.innerHTML=ve,l.document.body.style.background=n.colors.modalBg,l.document.body.style.color=n.colors.accentText}return l&&window.addEventListener("beforeunload",()=>{l==null||l.close()}),l}const ve=`
<svg class="loader" viewBox="0 0 50 50">
  <circle
    cx="25"
    cy="25"
    r="20"
    fill="none"
    stroke="currentColor"
    stroke-width="4"
  />
</svg>

<style>
  body,
  html {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  .loader circle {
    animation: loading 1.5s linear infinite;
  }

  @keyframes loading {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
`,Ee={google:ie,apple:se,facebook:re};function Ce(e){return/^\S+@\S+\.\S+$/.test(e.replace(/\+/g,""))}const _e=["email","phone","google","apple","facebook","passkey"],Pe=e=>{var O,M,F,z,D;const n=e.locale,{chain:s,client:o,connectModal:u}=T(),{done:i,wallet:l}=e,c=le(),v=L(),b={google:n.signInWithGoogle,facebook:n.signInWithFacebook,apple:n.signInWithApple},r=e.wallet.getConfig(),m=((O=r==null?void 0:r.auth)==null?void 0:O.options)||_e,q=m.includes("passkey"),W=m.indexOf("email"),S=W!==-1,$=m.indexOf("phone"),f=$!==-1,[p,B]=h.useState(()=>S&&f?W<$?"email":"phone":S?"email":f?"phone":"none"),R=p==="email"?n.emailPlaceholder:n.phonePlaceholder,U=p==="email"?n.emailRequired:n.phoneRequired;let I="text";p==="email"?I="email":p==="phone"&&(I="tel");const E=m.filter(a=>a==="google"||a==="apple"||a==="facebook"),A=E.length>0,Q=async a=>{try{const d=ke(a,v);if(!d)throw new Error("Failed to open login window");const C=l.connect({chain:s,client:o,strategy:a,openedWindow:d,closeOpenedWindow:X=>{X.close()}});await pe(a),c({socialLogin:{type:a,connectionPromise:C}}),e.select(),await C,i()}catch(d){console.error(`Error sign in with ${a}`,d)}};function J(){c({passkeyLogin:!0}),e.select()}const x=E.length>1;return(M=r==null?void 0:r.metadata)!=null&&M.image&&(!r.metadata.image.height||!r.metadata.image.width)&&console.warn("Image is not properly configured. Please set height and width.",r.metadata.image),t.jsxs(w,{flex:"column",gap:"md",style:{position:"relative"},children:[((F=r==null?void 0:r.metadata)==null?void 0:F.image)&&t.jsx(V,{loading:"eager",client:o,style:{maxHeight:"100px",maxWidth:"300px",margin:"auto"},src:r.metadata.image.src,alt:r.metadata.image.alt,width:(z=Math.min(r.metadata.image.width??300,300))==null?void 0:z.toString(),height:(D=Math.min(r.metadata.image.height??100,100))==null?void 0:D.toString()}),A&&t.jsx(w,{flex:x?"row":"column",center:"x",gap:"sm",style:{justifyContent:"space-between"},children:E.map(a=>{const d=x?j.lg:j.md;return t.jsxs(Le,{"aria-label":`Login with ${a}`,"data-variant":x?"icon":"full",variant:"outline",fullWidth:!x,onClick:()=>{Q(a)},children:[t.jsx(V,{src:Ee[a],width:d,height:d,client:o}),!x&&b[a]]},a)})}),u.size==="wide"&&A&&(S||f)&&t.jsx(ce,{text:n.or}),S&&t.jsx(t.Fragment,{children:p==="email"?t.jsx(G,{type:I,onSelect:a=>{c({emailLogin:a}),e.select()},placeholder:R,name:"email",errorMessage:a=>{if(!Ce(a.toLowerCase()))return n.invalidEmail},emptyErrorMessage:U,submitButtonText:n.submitEmail}):t.jsx(_,{client:o,icon:de,onClick:()=>{B("email")},title:"Email address"})}),f&&t.jsx(t.Fragment,{children:p==="phone"?t.jsx(G,{format:"phone",type:I,onSelect:a=>{c({phoneLogin:a.replace(/[-\(\) ]/g,"")}),e.select()},placeholder:R,name:"phone",errorMessage:a=>{const d=a.replace(/[-\(\) ]/g,"");if(!/^[0-9]+$/.test(d)&&f)return n.invalidPhone},emptyErrorMessage:U,submitButtonText:n.submitEmail}):t.jsx(_,{client:o,icon:ue,onClick:()=>{B("phone")},title:"Phone number"})}),q&&t.jsx(t.Fragment,{children:t.jsx(_,{client:o,icon:me,onClick:()=>{J()},title:"Passkey"})})]})};function $e(e){const n=e.locale.emailLoginScreen,{connectModal:s}=T(),o=s.size==="compact",{initialScreen:u,screen:i}=fe(),l=i===e.wallet&&u===e.wallet?void 0:e.goBack;return t.jsxs(w,{fullHeight:!0,flex:"column",p:"lg",animate:"fadein",style:{minHeight:"250px"},children:[o?t.jsxs(t.Fragment,{children:[t.jsx(xe,{onBack:l,title:n.title}),t.jsx(k,{y:"sm"})]}):null,t.jsx(w,{expand:!0,flex:"column",center:"y",p:o?void 0:"lg",children:t.jsx(Pe,{...e})}),o&&(s.showThirdwebBranding!==!1||s.termsOfServiceUrl||s.privacyPolicyUrl)&&t.jsx(k,{y:"xl"}),t.jsxs(w,{flex:"column",gap:"lg",children:[t.jsx(ye,{termsOfServiceUrl:s.termsOfServiceUrl,privacyPolicyUrl:s.privacyPolicyUrl}),s.showThirdwebBranding!==!1&&t.jsx(we,{})]})]})}const Le=he(ge)({"&[data-variant='full']":{display:"flex",justifyContent:"flex-start",padding:g.md,gap:g.md,fontSize:K.md,fontWeight:500,transition:"background-color 0.2s ease","&:active":{boxShadow:"none"}},"&[data-variant='icon']":{padding:g.sm,flexGrow:1}});async function Te(e){switch(e){case"es_ES":return(await y(()=>import("./es-1992b07e.js"),[],import.meta.url)).default;case"ja_JP":return(await y(()=>import("./ja-e5ffd66d.js"),[],import.meta.url)).default;case"tl_PH":return(await y(()=>import("./tl-8bfdf819.js"),[],import.meta.url)).default;default:return(await y(()=>import("./en-efd8c06e.js"),[],import.meta.url)).default}}function Be(){const e=T().locale,[n,s]=h.useState(void 0);return h.useEffect(()=>{Te(e).then(o=>{s(o)})},[e]),n}export{Pe as I,$e as a,ke as o,Be as u};
