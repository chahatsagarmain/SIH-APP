const nodemailer=require('nodemailer');
require('dotenv').config();
// const ContactUsEmail=require('../templates/contactFormRes');

const mailSender=async (email,title,body)=>{

    try {
        const transporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let response=await transporter.sendMail({
            from:"vineet kumar",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log("email response: ",response);
    } catch (error) {
        console.error(error);
        console.log("error occurred while sending mail:",error.message);
    }
   
}
module.exports = mailSender;