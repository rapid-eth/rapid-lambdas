const addressRegex = /^(0x|0X)[A-Fa-f0-9]{40}$/
const bytes32Regex = /^(0x|0X)[A-Fa-f0-9]{64}$/

const validateBody = (body) => {
    const { userAddress, certificate, config } = body;
    const { networkId, contractAddress, event, index } = config;

    if (!networkId || isNaN(networkId)) {     //if (!networkId || typeof networkId != Number) {
        return { error: "invalid or missing networkId" }
    }
    if (!contractAddress) {
        return { error: "missing config.contractAddress" }
    } else if (Array.isArray(contractAddress)) {
        let validFormat = true
        contractAddress.forEach(address => {
            validFormat = addressRegex.test(address)
        });
        if (!validFormat) {
            return { error: "invalid contract address format" }

        }
    } else if (!addressRegex.test(contractAddress)) {
        return { error: "invalid contract address" }
    }
    if (!userAddress || !addressRegex.test(userAddress)) {
        return { error: "invalid user address" }
    }
    if (!event) {
        //TODO check format
        return { error: "invalid event" }
    }
    // if (!certificate) {
    //     return { error: "no certificate" }
    // } else {
    //     if (certificate.type != "erc20") {
    //         return { error: "invalid certificate type" }
    //     }
    //     if (!certificate.address || !addressRegex.test(certificate.address)) {
    //         return { error: "invalid certificate address" }
    //     }
    //     if (!certificate.id) {
    //         return { error: "invalid certificate address" }
    //     }
    // }
    if (isNaN(index)) {     //if (!networkId || typeof networkId != Number) {
        return { error: "invalid or missing event index number" }
    }

    return { error: null }
}

module.exports = {
    validateBody
}