import{cf as I,aL as y,j as l,aN as m,b2 as S,b4 as z,aR as A,cg as v,b3 as B,ch as U,ci as W,cj as b,ck as C,cl as T,cm as O,b0 as P,cn as q,co as D,cp as F,cq as H,cr as M}from"./index-ec0f2259.js";function E(e){var i,g,d,u,x,h,f,k,w,j,r;const o=e.size==="compact",{initialScreen:t,screen:n}=I(),[s,a]=y.useState(!1),L=n===e.wallet&&t===e.wallet,c=L&&!e.isLinking?void 0:e.goBack;return l.jsxs(m,{fullHeight:!0,flex:"column",p:"lg",animate:"fadein",style:{minHeight:"250px"},children:[o&&(L?l.jsxs(l.Fragment,{children:[l.jsx(S,{onBack:c,leftAligned:!e.isLinking,title:l.jsxs(l.Fragment,{children:[(i=e.meta)!=null&&i.titleIconUrl?l.jsx(z,{src:(g=e.meta)==null?void 0:g.titleIconUrl,width:A.md,height:A.md,client:e.client}):null,l.jsx(v,{children:((d=e.meta)==null?void 0:d.title)??e.inAppWalletLocale.emailLoginScreen.title})]})}),l.jsx(B,{y:"lg"})]}):l.jsx(S,{onBack:c,title:e.inAppWalletLocale.signIn})),l.jsx(m,{expand:!0,flex:"column",center:"y",p:o?void 0:"lg",children:l.jsx(U,{...e,locale:e.inAppWalletLocale,disabled:((u=e.meta)==null?void 0:u.requireApproval)&&!s})}),o&&(((x=e.meta)==null?void 0:x.showThirdwebBranding)!==!1||((h=e.meta)==null?void 0:h.termsOfServiceUrl)||((f=e.meta)==null?void 0:f.privacyPolicyUrl))&&l.jsx(B,{y:"xl"}),l.jsxs(m,{flex:"column",gap:"lg",children:[l.jsx(W,{termsOfServiceUrl:(k=e.meta)==null?void 0:k.termsOfServiceUrl,privacyPolicyUrl:(w=e.meta)==null?void 0:w.privacyPolicyUrl,locale:e.connectLocale.agreement,requireApproval:(j=e.meta)==null?void 0:j.requireApproval,onApprove:()=>{a(!s)},isApproved:s}),((r=e.meta)==null?void 0:r.showThirdwebBranding)!==!1&&l.jsx(b,{})]})]})}function G(e){const o=C(),t=T(),n=o,s=e.connectLocale.id,a=O(s),{initialScreen:L}=I();if(!a)return l.jsx(P,{});const c=()=>{var d;L===e.wallet?t({}):((d=e.goBack)==null||d.call(e),t({}))},i=()=>{e.done(),t({})},g=n!=null&&n.emailLogin?{email:n.emailLogin}:n!=null&&n.phoneLogin?{phone:n.phoneLogin}:void 0;return g?l.jsx(q,{userInfo:g,locale:a,done:i,goBack:c,wallet:e.wallet,chain:e.chain,client:e.client,size:e.size,isLinking:e.isLinking}):n!=null&&n.passkeyLogin?l.jsx(D,{locale:e.connectLocale,wallet:e.wallet,done:i,onBack:c,chain:e.chain,client:e.client,size:e.size,isLinking:e.isLinking}):n!=null&&n.walletLogin?l.jsx(F,{meta:e.meta,inAppLocale:a,walletConnect:e.walletConnect,wallet:e.wallet,client:e.client,size:e.size,done:i,onBack:c||(()=>t({})),locale:e.connectLocale}):n!=null&&n.socialLogin?l.jsx(H,{socialAuth:n.socialLogin.type,locale:a,done:i,goBack:c,wallet:e.wallet,state:n,chain:e.chain,client:e.client,size:e.size,connectLocale:e.connectLocale,isLinking:e.isLinking}):n!=null&&n.guestLogin?l.jsx(M,{locale:a,done:i,goBack:c,wallet:e.wallet,state:n,client:e.client,size:e.size,connectLocale:e.connectLocale}):l.jsx(E,{select:()=>{},connectLocale:e.connectLocale,inAppWalletLocale:a,done:i,goBack:e.goBack,wallet:e.wallet,client:e.client,meta:e.meta,size:e.size,chain:e.chain,isLinking:e.isLinking})}export{G as default};