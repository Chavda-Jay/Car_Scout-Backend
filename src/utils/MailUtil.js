// const mailer = require("nodemailer")
// require("dotenv").config()

// const mailSend = async(to,subject,text,name)=>{
//     const transporter = mailer.createTransport({
//         service:"gmail",
//         auth:{
//             user:process.env.EMAIL_USER,
//             pass:process.env.EMAIL_PASSWORD
//         }
//     })
//     const mailOptions={
//         to:to,
//         subject:subject,
//         text:text,
//         html: `
//         <div style="font-family:Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
//             <div style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
                
//                 <!-- Header -->
//                 <div style="background-color:#007bff; padding:20px; text-align:center;">
//                     <h1 style="color:#ffffff; margin:0;">CarScout 🚗</h1>
//                 </div>

//                 <!-- Greeting -->
//                 <div style="padding:30px; text-align:center;">
//                     <h2 style="color:#333333;">Hey, ${name}!</h2>
//                     <p style="color:#555555; font-size:16px;">Thank you for registering with CarScout. Your journey to find the perfect car starts here!</p>
//                 </div>

//                 <!-- Main Car Image -->
//                 <div style="text-align:center; padding:0 30px 30px 30px;">
//                     <img 
//                           src="https://yourcarscoutwebsite.com/images/car.jpg" 
//                          alt="CarScout" 
//                          style="display:block; width:100%; max-width:500px; border-radius:10px;"
//                     >
//                 </div>

//                 <!-- CTA Button -->
//                 <div style="text-align:center; padding-bottom:30px;">
//                     <a href="https://yourcarscoutwebsite.com" target="_blank" 
//                        style="display:inline-block; background-color:#007bff; color:#ffffff; text-decoration:none; padding:15px 25px; border-radius:5px; font-size:16px;">
//                         Explore Cars
//                     </a>
//                 </div>

//                 <!-- Footer -->
//                 <div style="background-color:#f0f0f0; padding:20px; text-align:center; color:#888888; font-size:14px;">
//                     © 2026 CarScout. All rights reserved.
//                 </div>

//             </div>
            
//         </div>
//         `

//     }
//     const mailResponse = await transporter.sendMail(mailOptions)
//     console.log(mailResponse)
//     return mailResponse
// }
// module.exports=mailSend

const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSend = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"CarScout 🚗" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully:", info.response);
    return info;

  } catch (err) {
    console.log("Mail send error:", err.message);
    throw err;
  }
};

module.exports = mailSend;
