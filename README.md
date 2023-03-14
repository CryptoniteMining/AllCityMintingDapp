Guide for launching Dapp by @WesleyETH


```json
{
  "CONTRACT_ADDRESS": "0x827acb09a2dc20e39c9aad7f7190d9bc53534192",
  "SCAN_LINK": "https://polygonscan.com/token/0x827acb09a2dc20e39c9aad7f7190d9bc53534192",
  "NETWORK": {
    "NAME": "Polygon",
    "SYMBOL": "Matic",
    "ID": 137
  },
  "NFT_NAME": "Nerdy Coder Clones",
  "SYMBOL": "NCC",
  "MAX_SUPPLY": 1000,
  "WEI_COST": 75000000000000000,
  "DISPLAY_COST": 0.075,
  "GAS_LIMIT": 285000,
  "MARKETPLACE": "OpenSea",
  "MARKETPLACE_LINK": "https://opensea.io/collection/nerdy-coder-clones",
  "SHOW_BACKGROUND": true
}
```

Update config file from Rinkeby to Mainnet before launching. 
Also update the accounts.json file (make sure it matches the dapp accounts.json). Once the whitelist is fully ready, update the merkle tree build and then copy the addresses and paste them into the dapp accounts.json. 

Run "NPM Install"

Run "NPM Run Start"


