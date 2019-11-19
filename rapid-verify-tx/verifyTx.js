const { getProvider, compareHexStrings } = require('./common.js')

const verifyTransaction = async (body) => {
    console.log("verify event started")
    const { transactionHash, userAddress, config } = body
    const { networkId, toAddress, functionSignature, value } = config;

    console.log(transactionHash)
    console.log(config)

    //initialize ethers provider (networkId)
    const provider = getProvider(networkId)

    console.log(provider)

    let tx = await provider.getTransaction(transactionHash)

    console.log(tx)

    if (!tx) {
        console.log('tx not valid')
        return false
    }

    if (!compareHexStrings(tx.from, userAddress)) {
        console.log('userAddress did not match tx.from')
        return false
    }

    if (value) {
        if (tx.value < value) {
            console.log('tx value not high enough')
            return false
        }
    }

    if (functionSignature) {
        if (tx.data.lengh < 10) {
            console.log('no data on tx')
            return false
        }
        if (!compareHexStrings(tx.data.substring(0,10), functionSignature)) {
            console.log('function sig did not match')
            return false
        }
    }

    if (toAddress) {
        if (!compareHexStrings(toAddress,tx.to)) {
            console.log('toAddress did not match tx.to')
            return false
        }
    }
    return true
}


module.exports = {
    verifyTransaction
}