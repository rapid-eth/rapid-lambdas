let {verifyEvent} = require('./event')
let signer = require('./signing')
let { validateBody } = require('./dataValidation')
let { success, fail } = require('./common')

exports.handler = async (ev) => {
    console.log('one lambda to rule them all')
    const body = JSON.parse(ev.body)
    console.log(body)

    const { error } = validateBody(body);
    if (error) {
        return fail(error)
    }

    if (!await verifyEvent(body)) {
        return fail("no logs")
    }

    return success({cert: await signer.createCertificate(body)})
}