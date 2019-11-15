const querystring = require('querystring');

const mailgun = require("mailgun-js");

const mailgunAPIKey = process.env.MAILGUN_API_KEY
const DOMAIN = "mail.rapidteam.io";
const mg = mailgun({ apiKey: mailgunAPIKey, domain: DOMAIN });

const mailgunValidation = async (emailAddress, emailHash) => {

    const validationURLRoot = 'https://m2r4h61qui.execute-api.us-east-1.amazonaws.com/prod/rapid-site-email?'

    const queryObject = {
        e: emailAddress,
        h: emailHash
    }

    let qs = querystring.stringify(queryObject)
    let validationURL = validationURLRoot + qs

    console.log('validationURL', validationURL)

    //POST to sendgrid with custom_validation_url value
    const data = {
        from: "Rapid Team <subscribe@mail.rapidteam.io>",
        to: emailAddress,
        subject: "Please verify to subscribe",
        template: "site-subscribe",
        'h:X-Mailgun-Variables': JSON.stringify({ validation_url: validationURL })
    };
    let res = await mg.messages().send(data)
    console.log(res)
}


const addMemberToList = async (emailAddress, listName) => {

    const list = mg.lists(`${listName}@${DOMAIN}`);

    const member = {
        subscribed: true,
        address: emailAddress
    };

    try {
        const res = await list.members().create(member)
        console.log(res)
    } catch (err) {
        if (err.message.startsWith('Address already exists')) {
            console.log('duplicate')
        } else {
            throw err
        }
    }

}

module.exports = {
    mailgunValidation,
    addMemberToList
}