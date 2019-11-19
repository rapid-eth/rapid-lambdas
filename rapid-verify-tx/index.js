let {verifyTransaction} = require('./verifyTx')
let signer = require('./signer')
let { validateBody } = require('./dataValidation')
let { success, fail } = require('./common')

exports.handler = async (ev) => {
    console.log('verify tx')
    const body = JSON.parse(ev.body)
    console.log(body)

    const { error } = validateBody(body);
    if (error) {
        return fail(error)
    }

    if (!await verifyTransaction(body)) {
        return fail("transaction invalid")
    }

    return success({cert: await signer.createCertificate(body)})
}