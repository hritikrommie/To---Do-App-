const sgMail = require('@sendgrid/mail')

//const sendGridApiKey = ''

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const welcomeMail = (email, name)=>{
    sgMail.send({
        to: email,
        from:'hrtkdwd@gmail.com',
        subject: 'Welcome',
        text: `Welcome ${name}, How you are doing?`
    })
}

const cancelMail = (email, name)=>{
    sgMail.send({
        to: email,
        from:'hrtkdwd@gmail.com',
        subject: 'GoodBye',
        text: `Good Bye ${name}, Any feedback for us?`
    })
}

module.exports = {welcomeMail,cancelMail}

