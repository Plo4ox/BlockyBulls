import{SmartWalletConnector as o}from"./thirdweb-dev-wallets-evm-connectors-smart-wallet.browser.esm-e3f9ddd2.js";import{dH as a,af as n}from"./index-25b35aad.js";class c extends o{constructor(t){super({...t,factoryAddress:t.registryAddress||a}),this.tbaConfig=t}defaultFactoryInfo(){return{createAccount:async t=>t.prepare("createAccount",[this.tbaConfig.accountImplementation,this.chainId,this.tbaConfig.tokenContract,this.tbaConfig.tokenId,this.tbaConfig.salt,n("")]),getAccountAddress:async t=>await t.call("account",[this.tbaConfig.accountImplementation,this.chainId,this.tbaConfig.tokenContract,this.tbaConfig.tokenId,this.tbaConfig.salt])}}}export{c as TokenBoundSmartWalletConnector};