# Email Subscription Lambda

ONE lambda, TWO handlers...AMAZING!!

Handles POST requests from subscribe form on team website. This will create a subscription link and trigger an email to the specified address with the link in it.

Handles GET requests when users click the link in the email, verifies the hash is valid (anti-spam), and adds them to mailgun list


POST Request body: 

```json
{
    "email": "XoXoEthLover99XoXo@rapidteam.io"
}
```