let {verifyEvent} = require('./event')
let signer = require('./signer')
let { validateBody } = require('./dataValidation')


exports.handler = async (ev) => {
    console.log('one lambda to rule them all')
    console.log(process.env)
    console.log("signer pk " + process.env.SIGNER_PRIV_KEY)
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


const success = (s) => {
    console.log("SUCCESS")
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: JSON.stringify(s) || "ok",
    }
}

const fail = (reason) => {
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 400,
        body: JSON.stringify({ error: reason }),
    }
}