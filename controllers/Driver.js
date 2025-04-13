const Driver = require("../models/Driver");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  registerDriver: async (req, res) => {
    try {
      const {
        fullName,
        email,
        password,
        phoneNumber,
        licenseNumber,
        vehicle: { numberPlate, vehicleType, color, seating },
      } = req.body;
      if (
        !fullName ||
        !email ||
        !password ||
        !phoneNumber ||
        !numberPlate ||
        !vehicleType ||
        !licenseNumber ||
        !color ||
        !seating
      ) {
        return res
          .status(400)
          .json({ message: "Please add all the credentials" });
      }
      const existingDriver = await Driver.findOne({ email: email });
      if (existingDriver) {
        return res.status(400).json({
          message:
            "Driver with this email alrady exists,Try with another email",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const driver = new Driver({
        fullName: fullName,
        email: email,
        password: hashedPassword,
        phoneNumber: phoneNumber,
        licenseNumber: licenseNumber,
        vehicle: {
          numberPlate,
          vehicleType,
          seating,
          color,
        },
      });
      const savedDriver = await driver.save();
      res.status(201).json({
        message: "Driver registered successfully",
        success: true,
        savedDriver,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
      console.error("Error registering driver:", error);
    }
  },
  loginDriver: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "Driver have not added the credentials",
          success: false,
        });
      }
      // + sign before the field name forces Mongoose to include that field
      const savedDriver = await Driver.findOne({ email }).select("+password");
      if (!savedDriver) {
        return res.status(400).json({
          message: "Driver with this email not exists.Enter the correct email",
          success: false,
        });
      }
      const comparePassword = await bcrypt.compare(
        password,
        savedDriver.password
      );
      if (!comparePassword) {
        return res
          .status(400)
          .json({ message: "Wrong password", success: false });
      }
      const token = jwt.sign(
        { driverId: savedDriver._id },
        process.env.SECRET_KEY,
        { expiresIn: "1y" }
      );
      const driver = {
        fullName: savedDriver.fullName,
        id: savedDriver._id,
        email: savedDriver.email,
      };
      /* res.cookie("drivertoken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });*/
      res.status(200).json({
        message: `welcome Back ${driver.fullName.firstName} ${driver.fullName.lastName}`,
        sucess: true,
        token,
        driver,
      });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
  currentDriver: async (req, res) => {
    try {
      // Ensure req.id contains driverId
      const driverId = req.id;
      if (!driverId) {
        return res
          .status(400)
          .json({ message: "Invalid Driver ID", success: false });
      }
      //select via middleware and exclude password
      const driver = await Driver.findOne({ _id: driverId }).select(
        "-password"
      );
      if (!driver) {
        return res
          .status(404)
          .json({ message: "Driver  not found ", success: false });
      }
      res.status(200).json({
        message: "current Driver retreived successfully",
        success: true,
        driver,
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
      const driverId = req.id;
      if (!driverId) {
        return res
          .status(400)
          .json({ message: "Invalid Driver ID", success: false });
      }
      const driver = await Driver.findOne({ _id: driverId }).select(
        "-password"
      );
      if (!driver) {
        return res
          .status(404)
          .json({ message: "Driver  not found ", success: false });
      }
      res.clearCookie("drivertoken");
      res
        .status(200)
        .json({ message: "Driver logout successfully", success: true, driver });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
};
