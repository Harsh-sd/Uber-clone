const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");

dotenv.config();
module.exports = {
  signup: async (req, res) => {
    try {
      const errors = validationResult(req);
      //If there  an error exists
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { fullName, email, password } = req.body;
      if (!fullName || !email || !password) {
        return res.status(400).json({
          message: "User have not added the credentials",
          success: false,
        });
      }
      //check for existing user
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          message:
            "User with this email already exists , Try with another email",
          success: false,
        });
      }
      //Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        fullName: fullName,
        email: email,
        password: hashedPassword,
      });
      const savedUser = await user.save();
      res.status(201).json({
        message: "User signup successfully",
        success: true,
        user: {
          id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
        },
      });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      //If there  an error exists
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "User have not added the credentials",
          success: false,
        });
      }
      // + sign before the field name forces Mongoose to include that field
      const savedUser = await User.findOne({ email }).select("+password");
      if (!savedUser) {
        return res.status(400).json({
          message: "User with this email not exists.enter the correct email",
          success: false,
        });
      }
      const comparePassword = await bcrypt.compare(
        password,
        savedUser.password
      );
      if (!comparePassword) {
        return res
          .status(400)
          .json({ message: "Wrong password", success: false });
      }
      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "1y" }
      );
      const user = {
        fullName: savedUser.fullName,
        id: savedUser._id,
        email: savedUser.email,
      };
      res.cookie("token", token);
      res.status(200).json({
        message: `welcome Back ${user.fullName.firstName} ${user.fullName.lastName}`,
        sucess: true,
        token,
        user,
      });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
  currentUser: async (req, res) => {
    try {
      // Ensure req.id contains userId
      const userId = req.id;
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Invalid user ID", success: false });
      }

      //select via middleware and exclude password
      const user = await User.findOne({ _id: userId }).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ message: "User  not found ", success: false });
      }
      res.status(200).json({
        message: "current user retreived successfully",
        success: true,
        user,
      });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
  logout: async (req, res) => {
    try {
      const userId = req.id;
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Invalid user ID", success: false });
      }
      const user = await User.findOne({ _id: userId }).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ message: "User  not found ", success: false });
      }
      res.clearCookie("token");
      res
        .status(200)
        .json({ message: "User logout successfully", success: true, user });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
};
