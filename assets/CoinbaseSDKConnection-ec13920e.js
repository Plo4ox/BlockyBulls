import{aL as t,j as d,cK as g}from"./index-a46b0fa2.js";function h(e){const{onBack:l,done:o,wallet:c,walletInfo:s,onGetStarted:u,locale:n}=e,[f,a]=t.useState(!1),r=t.useCallback(()=>{a(!1),c.connect({client:e.client,chain:e.chain}).then(()=>{o()}).catch(S=>{console.error(S),a(!0)})},[e.client,c,e.chain,o]),i=t.useRef(!1);return t.useEffect(()=>{i.current||(i.current=!0,r())},[r]),d.jsx(g,{locale:{getStartedLink:n.getStartedLink,instruction:n.connectionScreen.instruction,tryAgain:n.connectionScreen.retry,inProgress:n.connectionScreen.inProgress,failed:n.connectionScreen.failed},onBack:l,walletName:s.name,walletId:c.id,errorConnecting:f,onRetry:r,onGetStarted:u,client:e.client,size:e.size})}export{h as default};