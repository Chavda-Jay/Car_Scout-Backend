// const User = require("../models/UserModel");

// // ================= REGISTER =================
// const register = async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, role } = req.body;

//     // check user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.json({ message: "User already exists" });
//     }

//     // create user
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       password,
//       role   // 🔥 important
//     });

//     await newUser.save();

//     res.json({ message: "Registration Successful" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ================= LOGIN =================
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email, password });

//     if (!user) {
//       return res.json({ message: "Invalid Email or Password" });
//     }

//     // 🔥 IMPORTANT → send role
//     res.json({
//       message: "Login Success",
//       user: {
//         _id: user._id,
//         firstName: user.firstName,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// module.exports = { register, login };



const User = require("../models/UserModel");
const mailSend = require("../utils/MailUtil");
const { getWelcomeEmailTemplate } = require("../utils/EmailTemplates");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role
    });

    await newUser.save();

    // Send professional welcome email after successful signup
    const welcomeTemplate = getWelcomeEmailTemplate({
      firstName,
      lastName,
      role: role || "user"
    });

    await mailSend(
      email,
      "Welcome to CarScout - Your account is ready",
      welcomeTemplate
    );

    res.json({ message: "Registration Successful" });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ message: "Invalid Email or Password" });
    }

    res.json({
      message: "Login Success",
      user: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };
