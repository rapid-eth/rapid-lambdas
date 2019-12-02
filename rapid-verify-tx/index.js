let {verifyTransaction} = require('./verifyTx')
let signer = require('./signing')
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

    let isVerified = await verifyTransaction(body)
    if (!isVerified) {
        return fail("transaction invalid")
    }

    const { certificate } = body;

    if (!certificate) {
        return success({verify: isVerified})
    }

    return success({cert: await signer.createCertificate(body)})
}