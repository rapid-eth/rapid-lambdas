const ethers = require('ethers')
const { getProvider } = require('./common.js')

// 0x81fb5AFdaC43d45b2f8eDB01F6D99972502B37c0
const signerAddress = () => {
  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY)
  return signerWallet.address
}

const createCertificate = async (body) => {
  const { userAddress, certificate } = body;
  const { type } = certificate;
  if (type.toLowerCase() === "erc20") {
    return await erc20CertificateSign(userAddress, certificate)
  } else if (type.toLowerCase() === "collectible") {
    return await collectibleCertificateSign(userAddress, certificate)
  } else {
    return { error: "unsupported certificate type" }
  }
}

const erc20CertificateSign = async (userAddress, certificate) => {
  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY)
  const { networkId, type, address, id } = certificate;
  const provider = getProvider(networkId)

  const certContract = new ethers.Contract(address, erc20CertStub, provider)

  try {
    let hashToSign = await certContract.getCertificateHash(id, userAddress)
    const messageHashBytes = ethers.utils.arrayify(hashToSign);
    let signed = await signerWallet.signMessage(messageHashBytes);
    return signed
  } catch (err) {
    if (err.code === "CALL_EXCEPTION") {
      return { error: "reward token contract does not implement certificates" }
    }
  }
}

const collectibleCertificateSign = async (userAddress, certificate) => {
  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY)
  let { networkId, type, nonce, address, id } = certificate;
  const provider = getProvider(networkId)

  const collectibleContract = new ethers.Contract(address, collectibleStub, provider)
  if (isNaN(nonce)) {
    console.log("Non-existant or Non-numeric nonce - defaulting to 0")
    nonce = 0;
  }
  try {
    let hashToSign = await collectibleContract.createCollectibleTypeCertificateHash(id, userAddress, nonce)
    const messageHashBytes = ethers.utils.arrayify(hashToSign);
    let signed = await signerWallet.signMessage(messageHashBytes);
    return signed
  } catch (err) {
    if (err.code === "CALL_EXCEPTION") {
      return { error: "collectible contract does not implement certificates" }
    }
  }
}

const sendFaucetTx = async (userAddress, amount) => {
  const provider = getProvider(4) //rinkeby only
  const faucetWallet = new ethers.Wallet(process.env.FAUCET_PRIV_KEY, provider)
  let bnAmount = ethers.utils.parseEther(amount)
  let tx = {
    to: userAddress,
    value: bnAmount,
  }
  let sentTx = await faucetWallet.sendTransaction(tx)
  console.log(sentTx)
}

const erc20CertStub = [{
    "constant": true,
    "inputs": [
      {
        "name": "_certificateID",
        "type": "bytes32"
      },
      {
        "name": "_redeemer",
        "type": "address"
      }
    ],
    "name": "getCertificateHash",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xd7174f22"
  }]

const collectibleStub = [{
  "constant": true,
  "inputs": [
    {
      "name": "_collectibleTypeID",
      "type": "bytes32"
    },
    {
      "name": "_to",
      "type": "address"
    },
    {
      "name": "_nonce",
      "type": "uint256"
    }
  ],
  "name": "createCollectibleTypeCertificateHash",
  "outputs": [
    {
      "name": "",
      "type": "bytes32"
    }
  ],
  "payable": false,
  "stateMutability": "view",
  "type": "function",
  "signature": "0x6730a24b"
}]

module.exports = {
  createCertificate,

  signerAddress,
  sendFaucetTx
}