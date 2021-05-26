const config = require("config")
const nodemailer = require("nodemailer")

exports.sendEmail = (to,subject,html)=>{
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        service:"gmail",
        auth:{
            user: config.get("email_user"),
            pass: config.get("email_password")
        }
    })

    let mailOptions = {
        from: config.get("email_user"),
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
        }
    })
}
