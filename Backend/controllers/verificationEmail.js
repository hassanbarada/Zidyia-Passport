const nodeMailer = require('nodemailer');
require('dotenv').config();

const emailVerification = async (email,subject,text) => {
    try{
        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPASS
            }, tls: {
        rejectUnauthorized: false
    }
        });

        const mailOptions = {
            from: process.env.EMAILUSER,
            to: email,
            subject: subject,
            text: text
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ error: 'Failed to send reset email' });
            } else {
              return res.status(200).json({ message: ' email sent successfully' });
              console.error("Email sended")
            }
          });

        
    }catch(error){
        console.log("error sending email :"+ error)
    }
}

module.exports = emailVerification;
