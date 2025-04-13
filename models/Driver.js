const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const driverSchema = new Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minLength: [3, "first name must be more than 3 characters"],
      },
      lastName: {
        type: String,
        required: true,
        minLength: [3, "last name must be more than 3 characters"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://default-avatar.com/avatar.png",
    },
    // Driver Verification
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    socketId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    availablity: {
      type: Boolean,
      default: true,
    },
    vehicle: {
      color: {
        type: String,
        minLength: [3, "color must be 3 character long"],
        required: true,
      },
      numberPlate: {
        type: String,
        required: true,
      },
      vehicleType: {
        type: String,
        enum: ["MotorCycle", "Car", "Auto"],
        required: true,
      },
      seating: {
        type: Number,
        min: [1, "Seating capacity must be greater than 1"],
        required: true,
      },
      insurance: {
        type: String,
      },
    },
    location: {
      //latitude
      ltd: {
        type: Number,
        min: -90,
        max: 90,
      },
      //longitude
      lng: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Driver", driverSchema);
