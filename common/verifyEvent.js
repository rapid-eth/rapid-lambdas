const ethers = require('ethers')
const { getProvider, padAddressToBytes32 } = require('./common.js')

const verifyEvent = async (body) => {
    const { userAddress, config } = body;
    const { networkId, contractAddress, event, index } = config;

    //initialize ethers provider (networkId)
    const provider = getProvider(networkId)

    let topic = ethers.utils.id(event);
    let topicArray = [topic]
    for (let i = 0; i < index; i++) {
        topicArray.push(null)
    }
    topicArray.push(padAddressToBytes32(userAddress))

    if (Array.isArray(contractAddress)) {
        for (let i = 0; i < contractAddress.length; i++) {
            const address = contractAddress[i];
            let filter = {
                address,
                fromBlock: 0, //TODO?
                toBlock: "latest",
                topics: topicArray
            }
        
            let logs = await provider.getLogs(filter)
            if (logs.length) {
                return true
            }
        }
    } else {
        let filter = {
            address: contractAddress,
            fromBlock: 0, //TODO?
            toBlock: "latest",
            topics: topicArray
        }
    
        let logs = await provider.getLogs(filter)
        if (logs.length) {
            return true
        }
    }

    return false
}


module.exports = {
    verifyEvent
}