let signer = require('./signing')
let { success, fail, getProvider } = require('./common')

exports.handler = async (ev) => {

    if (ev.httpMethod === 'GET') {
        return success({signerAddress: signer.signerAddress()})
    } else if (ev.httpMethod === 'POST') {
        console.log('faucet signer')
        const body = JSON.parse(ev.body)

        const { userAddress } = body;

        // check if they have rinkeby eth - if not send them a small amount
        let provider = getProvider(4)
        let balance = await provider.getBalance(userAddress)
        if (!balance.gt(0)) {
            await signer.sendFaucetTx(userAddress, "0.1")
        }

        let networkId = 4 //only rinkeby
        let type = "erc20"
        let address = process.env.CERT_CONTRACT_ADDRESS
        let id = process.env.INITIAL_CERT_ID

        let certificate = {networkId, type, address, id}
        let signature = await signer.createCertificate({userAddress, certificate})
        certificate.signature = signature
        return success({ certificate })
    }

}