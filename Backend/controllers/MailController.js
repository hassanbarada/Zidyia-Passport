const nodeMailer = require('nodemailer');
require('dotenv').config();


const sendEmail = (req,res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    const to = 'hasan.f2002@gmail.com';
    const html = `${firstname} ${lastname}
    From: ${email}
    Message: ${message}`;
    
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: to,
        subject: subject,
        text: html
    }

    transporter.sendMail(mailOptions, function(err,info){
        if(err){
            console.error(err);
            res.status(400).json(err)
        }else{
            console.log("email sent"+ info.response);
            res.status(200).json(info.response);
        }
    })

}

module.exports = sendEmail;
