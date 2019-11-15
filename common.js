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
    return (a1.toLowerCase() === a2.toLowerCase())
}


module.exports = {
    getProvider,
    padAddressToBytes32,
    compareHexStrings
}