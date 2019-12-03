const ethers = require('ethers')
let etherscanProvider = new ethers.providers.EtherscanProvider();
const quests = require('./exampleQuests.json')
const {verifyTransaction} = require('../common/verifyTx')

const main = async (address) => {

    let startBlock = 0;
    let endBlock = 99999999;
    // get tx list from etherscan for address
    // filter out any not 'from' address
    let txHistory = await etherscanProvider.getHistory(address, startBlock, endBlock)
    console.log(txHistory.length)

    // filter out any not 'from' address
    txHistory = txHistory.filter(tx => compareHexStrings(tx.from, address))

    // check list against known addresses to verify
    let txQuests = quests.quests.filter(q => q.config.type === "transaction")
    console.log(txQuests)

    let txToAddresses = []
    for (let i = 0; i < txQuests.length; i++) {
        const q = txQuests[i];
        if (q.config.toAddress) {
            if (Array.isArray(q.config.toAddress)) {
                txToAddresses.push.apply(txToAddresses, q.config.toAddress)
            } else {
                txToAddresses.push(q.config.toAddress)
            }
        }
    }
    txToAddresses = txToAddresses.map(v => v.toLowerCase());
    console.log(txToAddresses)


    // //get relevant transactions
    let relevantToAddresses = []
    txHistory = txHistory.filter(tx => {
        if (tx.to) {
            if (!relevantToAddresses.includes(tx.to.toLowerCase()) && txToAddresses.includes(tx.to.toLowerCase())) {
                relevantToAddresses.push(tx.to.toLowerCase())
            }
            return txToAddresses.includes(tx.to.toLowerCase())
        }
    })

    console.log(relevantToAddresses)

    //get relevant questIDs from relevant addresses
    txQuests = txQuests.filter(q => {
        if (Array.isArray(q.config.toAddress)){
            let cross = q.config.toAddress.filter(e => relevantToAddresses.includes(e))
            return cross > 0 ? true : false
        } else {
          return relevantToAddresses.includes(q.config.toAddress.toLowerCase())
        }
    })

    console.log(txQuests)

    console.log(txHistory)

    let validQuests = []

    // for each quest...check if tx satisfies it
    for (let i = 0; i < txQuests.length; i++) {
        const q = txQuests[i];
        for (let j = 0; j < txHistory.length; j++) {
            const tx = txHistory[j];
            let b = {
                userAddress: address,
                transactionHash: tx.hash,
                config: q.config
            }
            if (await verifyTransaction(b)) {
                validQuests.push({questId: q.questId, tx: tx.hash})
                break
            }
        }
    }

    console.log("ALL VALID TX FOR ADDRESS: "  + address)
    console.log(validQuests)

}
const compareHexStrings = (a1, a2) => {
    return (a1.toLowerCase() === a2.toLowerCase())
}


main('0xb68CDa5e9327461Bfe63704e68c2a33b9c077cdf')