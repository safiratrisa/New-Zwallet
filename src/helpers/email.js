const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

exports.sendEmail = (emailto) =>{
    console.log(sendid)
    return new Promise((resolve, reject)=>{
        host=process.env.BASE_URL
        link=host+"/users/verify/"+sendid;
        console.log(link)
        const message = {
            from: process.env.EMAIL_USERNAME,
            to: emailto,
            subject: "ACTIVATION EMAIL", 
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
        }
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(error)
                reject(error)
            } else {
                resolve(info)
            }
        });
    })
}