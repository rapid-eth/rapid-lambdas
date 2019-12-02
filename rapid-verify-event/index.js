let { verifyEvent } = require('./event')
let signer = require('./signing')
let { validateBody } = require('./dataValidation')
let { success, fail } = require('./common')

exports.handler = async (ev) => {

    if (ev.httpMethod === 'GET') {
        return success({ signerAddress: signer.signerAddress() })
    } else if (ev.httpMethod === 'POST') {
        const body = JSON.parse(ev.body)
        console.log(body)

        const { error } = validateBody(body);
        if (error) {
            return fail(error)
        }

        let isVerified = await verifyEvent(body)
        if (!isVerified) {
            return fail("No event found")
        }
        const { certificate } = body;

        if (!certificate) {
            return success({ verify: isVerified })
        }

        return success({ cert: await signer.createCertificate(body) })
    }

}