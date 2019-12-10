const ethers = require('ethers')

const getProvider = (networkId) => {
    switch (networkId) {
        case 1:
            return ethers.getDefaultProvider('homestead');
        case 4:
            return ethers.getDefaultProvider('rinkeby');
        default:
            break;
    }
}

const padAddressToBytes32 = (address) => {
    return '0x000000000000000000000000' + address.substring(2)
}

const compareHexStrings = (a1, a2) => {
    console.log("Compare a1", a1)
    console.log("Compare a2", a2)
    return (a1.toLowerCase() === a2.toLowerCase())
}

const success = (s) => {
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: JSON.stringify(s) || "ok",
    }
}

const fail = (reason, code) => {
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: code || 400,
        body: JSON.stringify({ error: reason }),
    }
}

module.exports = {
    getProvider,
    padAddressToBytes32,
    compareHexStrings,
    success,
    fail
}