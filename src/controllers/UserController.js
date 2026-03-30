const userSchema = require("../models/UserModel")
const bcrypt = require("bcrypt")
const mailSend = require("../utils/MailUtil")
const jwt = require("jsonwebtoken")
const secret = "secret"

// const registerUser = async(req,res)=>{
//     try{
//         const hashedPassword = await bcrypt.hash(req.body.password,10)
        
//         const savedUser = await userSchema.create({...req.body,password:hashedPassword})
//         //const savedUser = await userSchema.create(req.body)
//         await mailSend(savedUser.email,"Welcome To Car WebSite","Thank You For Registering With Our App.")
//         res.status(201).json({
//             message:"user created successfully",
//             data:savedUser
//         })
//     }catch(err){
//         res.status(500).json({
//             message:"error while creating user",
//             err:err
//         })
//     }
// }

const registerUser = async(req,res)=>{
    try{
        const existingUser = await userSchema.findOne({ email: req.body.email });
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password,10)
    
        const savedUser = await userSchema.create({
            ...req.body,
            email:req.body.email.toLowerCase(),
            password: hashedPassword
        })

        // 🔹 Email content for welcome email
    const mailHtml = `
      <div style="font-family:Arial, sans-serif; text-align:center; padding:20px;">
        <h2>Hey, ${savedUser.firstName}, 👋</h2>
        <p>Thank you for registering with CarScout. Your journey to find the perfect car starts here!</p>
        <a href="http://localhost:5173/" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; border-radius:5px; text-decoration:none;">Explore Cars</a>
      </div>
    `;
    
     // send email using MailUtil
        try{
            await mailSend(
                savedUser.email,
                "Welcome To Car WebSite",
                "Thank You For Registering With Our App.",
                mailHtml
            )
        }catch(mailErr){
            console.log("Mail Error:", mailErr.message)
            // ❗ API fail nahi hogi
        }
        res.status(201).json({
            message:"user created successfully",
            data:savedUser
        })

    }catch(err){
        console.log("Register Error:", err)
        res.status(500).json({
            message:"error while creating user",
            error:err.message
        })
    }
}

const loginUser = async(req,res)=>{
    try{
        const{email,password}=req.body
        const foundUserFromEmail=await userSchema.findOne({email:email})
        console.log(foundUserFromEmail)
        if(foundUserFromEmail){
            const isPasswordMatched = await bcrypt.compare(password,foundUserFromEmail.password)
            if(isPasswordMatched){
                const token = jwt.sign(foundUserFromEmail.toObject(),secret) //all object id  
                res.status(200).json({
                    message:"Login Success",
                    //data:foundUserFromEmail, 
                    token:token,
                    role:foundUserFromEmail.role,
                    user: foundUserFromEmail
                })
            }
            else{
                res.status(401).json({
                    message:"Invalid Credentials"
                })
            }
        }else{
            res.status(404).json({
                message:"User Not Found"
            })
        }
    }catch(err){
        res.status(500).json({
            message:"error while logging in",
            err:err
        })
    }
}

const forgotPassword = async(req,res)=>{
    const {email} = req.body;
    if(!email) return res.status(400).json({
        message:"Email is not provided"
    });

    const foundUserFromEmail = await userSchema.findOne({email:email});
    if(foundUserFromEmail){
        // 🔹 JWT token generate
        const token = jwt.sign(foundUserFromEmail.toObject(), secret, {expiresIn: 60*24*7}); // 7 days
        const url = `http://localhost:5173/resetpassword/${token}`; // reset link
        console.log("Reset Link:", url);

        // 🔹 Important change: HTML content for email
        const mailHtml = `
            <div style="font-family:Arial, sans-serif; text-align:center; padding:20px;">
                <h2>Hi ${foundUserFromEmail.firstName},</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${url}" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; border-radius:5px; text-decoration:none;">RESET PASSWORD</a>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `;

        // 🔹 Send email using MailUtil
        await mailSend(foundUserFromEmail.email, "Reset Password Link", mailHtml);

        res.status(200).json({
            message:"Reset link has been sent to your email"
        });
    } else {
        res.status(404).json({
            message:"User not found.."
        });
    }
}

const resetpassword = async(req,res)=>{
    //const {newPassword,token}=req.body
    const { newPassword } = req.body;
    const token = req.params.token;   
    try{

        const decodedUser = await jwt.verify(token,secret) //{userobject}
        const hashedPassword =await  bcrypt.hash(newPassword,10)
        const updatedUser = await userSchema.findByIdAndUpdate(decodedUser._id,{password:hashedPassword})
        res.status(200).json({
            message:"password reset successfully !!",
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"server error..",
            err:err
        })
    }
}



// New Functions For Admin 

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await userSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' } // ya new:true bhi chal sakta hai, mongoose warning fix ke liye
    );
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



module.exports={registerUser,loginUser,forgotPassword,resetpassword,getAllUsers,getUserById,updateUser,deleteUser}