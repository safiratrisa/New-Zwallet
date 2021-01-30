const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

exports.sendEmailReset = () =>{
    return new Promise((resolve, reject)=>{
        host=process.env.FRONTEND_URL
        link=host+"/auth/resetpass/";
        const message = {
            from: process.env.EMAIL_USERNAME,
            to: senddata.email,
            subject: "Change Password", 
            html : `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <style>
              h2{
                text-align: center;
                color: #6379F4;
                font-size: 30px;
              }
              h3 {
                text-align: center;
                color:black;
                font-size: 24px; 
              }
              h4 {
                text-align: center;
                color:rgb(82, 79, 79);
                font-size: 18px; 
              }
              .wrapper {
                  background-color: #dbe0ff;
                  padding-top: 2%;
                  padding-bottom: 2%;
              }
              button {
                height: 57px;
                width: 300px;
                border-radius: 12px;
                background: #6379F4;
                border: none;
                outline: none;
                margin-top: 1%;
                cursor: pointer;
            }
            a {
                text-decoration: none;
                font-weight: bold;
                font-size: 18px;
                color: #FFFFFF;
            }
            .btn {
                text-align: center;
            }
            </style>
            </head>
            <body>
            <h2>ZWALLET</h2>
              <div class="wrapper">
                <h4>To change your password, please put the verification code to the Email Verification Code Field in Reset Password Page</h4>
                <h4>Your verification code: ${senddata.resetid}</h4>
              </div>
              <div class="btn">
                <button><a href="http://localhost:8080/auth/resetpass">Reset Password</a></button>
              </div>
            </body>
            </html>`, // html body
        }
        transporter.sendMail(message, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve(info)
            }
        });
    })
}