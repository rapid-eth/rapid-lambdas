# Rapid Transaction Verification Certificate Signer

This lambda verifies that an address created a transaction with specified parameters and signs a certificate for that address if so.

Example Request:

```json
{
	"transactionHash": "0x60991e9181f9e289c6cd658b18e2e89f6648eb86951ac3839a96fd55eaedf148",
	"userAddress": "0x342fe81f80ad854a3aa3c1dc2937999a49d9a8bd",
	"config": {
		"networkId": 4,
		"functionSignature": "0xc4b794aa",
		"toAddress": "0x4b001411186583fd65b8c0b92a57ff028a459f9f",
		"value": 3,
	},
	"certificate": {
		"networkId": 4,
		"type": "erc20",
		"address": "0xDa0E7a56Bc25b12797206d0768aa51F6fE829B93",
		"id": "0x511539f3af56f3f4aa25f107466c09f9668f3d98d951f5bffee0618a4c92d0dc"
	}
}
```
 