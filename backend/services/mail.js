const nodemailer = require("nodemailer");

const from = process.env['GMAIL_SENDER']

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: from,
        pass: process.env['GMAIL_PASSWORD'],
    },
});

const sendMail = async ({
    to,
    content,
    subject
}) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: from,
        to,
        subject,
        html: content,
    });

    console.log(`Message sent to ${to} from ${from}: ${info.messageId}`);
}

module.exports = {
    sendMail
}