const addressRegex = /^(0x|0X)[A-Fa-f0-9]{40}$/
const bytes32Regex = /^(0x|0X)[A-Fa-f0-9]{64}$/

const validateBody = (body) => {
    const { networkId, contractAddress, userAddress, event, verificationMethod, param, certificate } = body;

    if (!networkId || isNaN(networkId)) {     //if (!networkId || typeof networkId != Number) {
        return { error: "invalid or missing networkId" }
    }
    if (!contractAddress || !addressRegex.test(contractAddress)) {
        return { error: "invalid contract address" }
    }
    if (!userAddress || !addressRegex.test(userAddress)) {
        return { error: "invalid user address" }
    }
    if (!event) {
        //TODO check format
        return { error: "invalid event" }
    }
    if (!certificate) {
        return { error: "no certificate" }
    } else {
        if (certificate.type != "erc20") {
            return { error: "invalid certificate type" }
        }
        if (!certificate.address || !addressRegex.test(certificate.address)) {
            return { error: "invalid certificate address" }
        }
        if (!certificate.id) {
            return { error: "invalid certificate address" }
        }
    }
    switch (verificationMethod) {
        case "sender":
            break;
        case "param":
            if ((param === undefined) || isNaN(param)) {
                return { error: "invalid event parameter index (must be integer)" }
            }
            break;
        default:
            return { error: "invalid verificationMethod" }

    }
    return {error: null}
}

module.exports = {
    validateBody
}