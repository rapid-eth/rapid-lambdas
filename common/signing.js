const ethers = require('ethers')
const { getProvider } = require('./common.js')

// 0x81fb5AFdaC43d45b2f8eDB01F6D99972502B37c0
const signerAddress = () => {
  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY)
  return signerWallet.address
}

const createCertificate = async (body) => {
  console.log(process.env)
  const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY)

    const { userAddress, certificate } = body;
    const { networkId, type, address, id } = certificate;
    const provider = getProvider(networkId)
    
    const certContract = new ethers.Contract(address,erc20CertStub,provider)
    try {
      let hashToSign = await certContract.getCertificateHash(id, userAddress)
      const messageHashBytes = ethers.utils.arrayify(hashToSign);
      let signed = await signerWallet.signMessage(messageHashBytes);
  
      return signed
    } catch (err) {
      if (err.code==="CALL_EXCEPTION") {
        return {error: "reward token contract does not implement certificates"}
      }
    }


}

const erc20CertStub = [
    {
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
      },
]


module.exports = {
    createCertificate,
    signerAddress
}