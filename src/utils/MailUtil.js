const mailer = require("nodemailer")
require("dotenv").config()

const mailSend = async(to,subject,text)=>{
    const transporter = mailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions={
        to:to,
        subject:subject,
        text:text,
        html: `<div style="font-family:Arial">
                    <h2 style="color:blue">Welcome to Car Website 🚗</h2>
                    <p>Thank you for registering with our application.</p>
                    <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70" width="400"/>
                    <p>Enjoy our platform!</p>
             </div>`

    }
    const mailResponse = await transporter.sendMail(mailOptions)
    console.log(mailResponse)
    return mailResponse
}
module.exports=mailSend