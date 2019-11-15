const ethers = require('ethers')
const { getProvider, padAddressToBytes32 } = require('./common.js')

const verifyEvent = async (body) => {
    console.log("verify event started")

    const { networkId, contractAddress, userAddress, event, verificationMethod, param } = body;

    //initialize ethers provider (networkId)
    const provider = getProvider(networkId)

    //if verification method sender
    // somehow find tx from userAddress to contract address
    if (verificationMethod == "sender") {
        //return { error: "sorry not supporting sender verification method yet" }
        console.log("SENDER")
    }

    //else if verification method param
    //filter for contract events (contractAddress, event, userAddress, param)

    let topic = ethers.utils.id(event);
    let topicArray = [topic]
    for (let i = 0; i < param; i++) {
        topicArray.push(null)
    }
    topicArray.push(padAddressToBytes32(userAddress))

    console.log(topicArray)


    let filter = {
        address: contractAddress,
        fromBlock: 0, //TODO?
        toBlock: "latest",
        topics: topicArray
    }



    let logs = await provider.getLogs(filter)
    console.log(logs.length)
    if (logs.length) {
        return true
    }

    return false
}


module.exports = {
    verifyEvent
}