# Examples

## 1 Maker Dao
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "0x448a5065aebb8e423f0896e6c5d525c040f59af3",
    "event": "LogNewCup(address,bytes32)",
    "index": 0
}
```
Example tx: https://etherscan.io/tx/0x79782d79260afcc6b93cd57c25c5eb96da882651bd4a38599f3cfa855cf3b819

## 2 Compound
For cEth:
```json
"config": {
    "type": "transaction",
    "networkId": 1,
    "functionSignature": "0x1249c58b", // mint()
    "value": true, // ?
    "toAddress": "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"
},
```

For cTokens:
```json
"config": {
    "type": "transaction",
    "networkId": 1,
    "functionSignature": "0xa0712d68", // mint(uint256)
    "value": null,
    "toAddress": ["0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e","0xf5dce57282a584d2746faf1593d3121fcac444dc","0x158079ee67fce2f58472a96584a73c7ab9ac95c1","0x39aa39c021dfbae8fac545936693ac917d5e7563","0xc11b1268c1a384e55c48c2391d8d480264a3a7f4","0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407"]
},
```

## 3 Decentraland
Contract Address: 0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d (LAND erc721)

## 4 Gods Unchained
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "0x0E3A2A1f2146d86A604adc220b4967A898D7Fe07",
    "event": "Transfer(address,address,uint256)",
    "index": 1
}
```

## Helena

Does not appear to be live on the mainnet (if I can spend half an hour googling, inspecting source code and reading docs and still not find the address OR code its pretty bad)

## Augur

Each Market is a new smart contract so it will be pretty difficult to validate this without dynamically getting the address

https://github.com/AugurProject/augur-core/blob/master/source/contracts/reporting/Universe.sol#L447
Universe Contract Address: 0xe991247b78f937d7b69cfc00f1a487a293557677

## cryptokitties
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
    "event": "Transfer(address,address,uint256)",
    "index": 1
}
```

## Gitcoin Kudos
```json
"config": {
    "type": "transaction",
    "networkId": 1,
    "functionSignature": "0xed74de9d", // clone(address,uint256,uint256)
    "value": null,
    "toAddress": "0x2aEa4Add166EBf38b63d09a75dE1a7b94Aa24163"
},
```

https://github.com/gitcoinco/gitcoin-erc721/blob/master/contracts/Kudos.sol

## Gitcoin bounties (Bounties V1)
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "0x2af47a65da8cd66729b4209c22017d6a5c2d2400",
    "event": "ContributionAdded(uint256,address,uint256)",
    "index": 0
}
```

https://etherscan.io/address/0x2af47a65da8cd66729b4209c22017d6a5c2d2400#code


## Gitcoin grants

Each grant is its own contract so its impossible to check based on the address
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "",
    "event": "ExecuteSubscription(address,address,address,uint256,uint256,uint256,uint256)",
    "index": 0
}
```

https://github.com/gitcoinco/grants1337/blob/master/Subscription/Subscription.sol

## Bounties Network - Standard Bounties (V2)

Issue and contribute function:
```json
"config": {
    "type": "transaction",
    "networkId": 1,
    "functionSignature": "0xfdafa365", // issueAndContribute(address,address,address[],string,uint256,address,uint256,uint256)
    "value": true,
    "toAddress": "0xa7135d0a62939501b5304a04bf00d1a9a22f6623"
},
```

Contribute function:
```json
"config": {
    "type": "transaction",
    "networkId": 1,
    "functionSignature": "0xa08f793c", // contribute(address,uint256,uint256)
    "value": true,
    "toAddress": "0xa7135d0a62939501b5304a04bf00d1a9a22f6623"
},
```

https://etherscan.io/address/0xa7135d0a62939501b5304a04bf00d1a9a22f6623#code
https://github.com/Bounties-Network/StandardBounties

## Gitcoin Quests

`"completionCriteria": "1. User receives the Kudos from the Pitch your Ethereum Killer to the VC-Bro quest"`

currently we are not able to validate on custom parameters inside contracts (the id/uri of the cloned gitcoin kudos)

## ENS

This assumes user is registering with the Main net default resolver
```json
"config": {
    "type": "event",
    "networkId": 1,
    "contractAddress": "0xB22c1C159d12461EA124b0deb4b5b93020E6Ad16",
    "event": "NameRegistered(string,bytes32,address,uint256,uint256)",
    "index": 1
}
```

https://etherscan.io/address/0xb22c1c159d12461ea124b0deb4b5b93020e6ad16#code