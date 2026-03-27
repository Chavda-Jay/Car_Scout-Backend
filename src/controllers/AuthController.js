const User = require("../models/UserModel");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role   // 🔥 important
    });

    await newUser.save();

    res.json({ message: "Registration Successful" });

  } catch (err) {
    console.log(err);
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

    // 🔥 IMPORTANT → send role
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
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login };