const userSchema = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailSend = require("../utils/MailUtil");
const jwt = require("jsonwebtoken");
const { getWelcomeEmailTemplate } = require("../utils/EmailTemplates");

const secret = "secret";

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const existingUser = await userSchema.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const savedUser = await userSchema.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
    });

    const mailHtml = getWelcomeEmailTemplate({
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      role: savedUser.role,
    });

    try {
      await mailSend(
        savedUser.email,
        "Welcome to CarScout - Your account is ready",
        mailHtml
      );
    } catch (mailErr) {
      console.log("Mail Error:", mailErr.message);
    }

    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json({
      message: "Error while creating user",
      error: err.message,
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUserFromEmail = await userSchema.findOne({
      email: email.toLowerCase(),
    });

    if (!foundUserFromEmail) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUserFromEmail.password
    );

    if (!isPasswordMatched) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        _id: foundUserFromEmail._id,
        firstName: foundUserFromEmail.firstName,
        email: foundUserFromEmail.email,
        role: foundUserFromEmail.role,
      },
      secret
    );

    res.status(200).json({
      message: "Login Success",
      token: token,
     user: {
          _id: foundUserFromEmail._id,
          firstName: foundUserFromEmail.firstName,
          lastName: foundUserFromEmail.lastName,
          email: foundUserFromEmail.email,
          role: foundUserFromEmail.role,
          profilePic: foundUserFromEmail.profilePic,
        },

    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({
      message: "Error while logging in",
      error: err.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is not provided",
      });
    }

    const foundUserFromEmail = await userSchema.findOne({
      email: email.toLowerCase(),
    });

    if (!foundUserFromEmail) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = jwt.sign(
      {
        _id: foundUserFromEmail._id,
        email: foundUserFromEmail.email,
      },
      secret,
      { expiresIn: "7d" }
    );

    const url = `http://localhost:5173/resetpassword/${token}`;

    const mailHtml = `
      <div style="font-family:Arial, sans-serif; padding:20px;">
        <h2>Hi ${foundUserFromEmail.firstName},</h2>
        <p>Click the button below to reset your password.</p>
        <a href="${url}" style="display:inline-block; padding:12px 20px; background:#22d3ee; color:#0f172a; border-radius:8px; text-decoration:none; font-weight:700;">
          Reset Password
        </a>
        <p style="margin-top:16px;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    await mailSend(foundUserFromEmail.email, "Reset Password Link", mailHtml);

    res.status(200).json({
      message: "Reset link has been sent to your email",
    });
  } catch (err) {
    console.log("Forgot Password Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ================= RESET PASSWORD =================
const resetpassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const token = req.params.token;

    const decodedUser = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userSchema.findByIdAndUpdate(decodedUser._id, {
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password reset successfully !!",
    });
  } catch (err) {
    console.log("Reset Password Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ================= ADMIN FUNCTIONS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await userSchema.find();
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userSchema.findById(req.params.id);
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userSchema.findByIdAndUpdate(req.params.id, req.body, {
  returnDocument: "after",
});
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { profilePic: req.file.path },
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("PROFILE PIC ERROR:", err);
    res.status(500).json({
      message: "Error while updating profile picture",
      error: err.message,
    });
  }
};

const removeProfilePic = async (req, res) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.params.id,
      { profilePic: "" },
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Profile picture removed successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log("REMOVE PROFILE PIC ERROR:", err);
    res.status(500).json({
      message: "Error while removing profile picture",
      error: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetpassword,
  getAllUsers,
  getUserById,
  updateUser,
  updateProfilePic,
  removeProfilePic,
  deleteUser,
};
