const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

exports.sendEmail = (emailto, text) =>{
  console.log(text)
  return new Promise((resolve, reject)=>{
      rand = Math.floor((Math.random()*1000000))
    //   console.log(rand)
      host=process.env.BASE_URL
      link=host+"/users/verify/"+rand;
      console.log(link)
    const message = {
      from: process.env.EMAIL_USERNAME, // sender address
      to: emailto, // list of receivers
      subject: "ACTIVATION EMAIL", // Subject line
    //   text: "hallo"
      html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error)
        reject(error)
      }else{
        resolve(info)
      }
      });
  })

}