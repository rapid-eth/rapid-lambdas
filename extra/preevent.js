const ethers = require('ethers')
const quests = require('./exampleQuests.json')
const {verifyEvent} = require('../common/verifyEvent')

const main = async (address) => {

    let verifiedEvents = []

    let eventQuests = quests.quests.filter(q => q.config.type === "event")
    //for each quest event, run verify event
    for (let i = 0; i < eventQuests.length; i++) {
        const q = eventQuests[i];
        let b = { userAddress: address, config: q.config}
        let v = await verifyEvent(b)
        if (v) {
            verifiedEvents.push(q)
        }
    }
    
    console.log(verifiedEvents)
}


main('0xb68CDa5e9327461Bfe63704e68c2a33b9c077cdf')