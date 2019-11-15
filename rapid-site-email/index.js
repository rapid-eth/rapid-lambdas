const mailgun = require('./mailgun')
const emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const crypto = require('crypto')

exports.handler = async (event) => {
    

    if (event.httpMethod === 'GET') {
        console.log('GET - rapid site email')

        let params = event.queryStringParameters
        if (!params) {
            return getFail("no email/hash parameter specified")
        }
        let { e, h } = params
        
        console.log("email", e, h)
        //check email with hash
        const v = verifyEmailHash(e,h)
        if (!v) {
            return getFail("invalid email hash")
        }        
        
        //add to sendgrid list

        // "name": "rapid-site-subscriber",
        // "id": "64612c40-1ab9-4212-983c-d47f57da162c",
        //await sendgrid.addToSendGridList(e, "64612c40-1ab9-4212-983c-d47f57da162c")
        await mailgun.addMemberToList(e, 'subscriber')
        
        return getSuccess();
    } else if (event.httpMethod === 'POST') {
        console.log('POST - rapid site email')
        const body = JSON.parse(event.body)
        let { email } = body;
        if (!email || !emailRegex.test(email) ) {
            return getFail("no vaild email field")
        }
        let hash = createEmailHash(email)
        
        //await sendgrid.sendGridValidation(email,hash)

        await mailgun.mailgunValidation(email,hash)

        return postSuccess()
    } else {
        return getFail("Must use GET or POST")
    }
}


const createEmailHash = (emailAddress) => {
    const hash = crypto.createHash('sha256')
    hash.update(process.env.HASH_SECRET)
    hash.update(emailAddress)
    return hash.digest('hex')
}


const verifyEmailHash = (emailAddress, hexDigest) => {
    let hash = createEmailHash(emailAddress)
    return (hash === hexDigest)
}


const getSuccess = () => {
    return {
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: pagehtml,
    }
}
const postSuccess = () => {
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 200,
        body: "ok",
    }
}

const getFail = (reason) => {
    return {
        headers: {
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            "Access-Control-Allow-Origin": "*"
        },
        statusCode: 400,
        body: JSON.stringify({error: reason}),
    }
}

const pagehtml = `
<!DOCTYPE html>
<html>
   <head>
      <title>Thank You For Subscribing</title>
      <meta http-equiv = "refresh" content = "0; url = https://rapidteam.io" />
   </head>
   <body>
      <p>Thank You For Subscribing</p>
   </body>
</html>`