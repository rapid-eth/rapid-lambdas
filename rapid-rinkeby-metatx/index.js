let signer = require('./signing')
let ethers = require('ethers')
let metaProxyABI = require('./MetaProxy.json').abi

let { success, fail, getProvider } = require('./common')
const metaProxyAddress = "0xC5E99c432755831c8fA485B6b8AAa9615b857b60"

exports.handler = async (ev) => {

    if (ev.httpMethod === 'GET') {
        return success({please: "use POST"})
    } else if (ev.httpMethod === 'POST') {
        const body = JSON.parse(ev.body)

        // parse metatx info
        const { metaTx } = body;

        // verify we want to pay for it
        let provider = getProvider(4)
        const metaProxyContract = new ethers.Contract(metaProxyAddress, metaProxyABI, provider)
        let mtxObj = await metaProxyContract.rawToMetaTx(metaTx)
        console.log(mtxObj)
        let metaSignerAddress = await metaProxyContract.verifySigner(mtxObj)
        console.log(metaSignerAddress)
        
        // sendTransaction
        // return txId
        console.log(process.env.SIGNER_PRIV_KEY)
        const signerWallet = new ethers.Wallet(process.env.SIGNER_PRIV_KEY, provider)

        let connected = metaProxyContract.connect(signerWallet)
        let tx = await connected.proxy(metaTx)

        return success({ tx })
    }

}