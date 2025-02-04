const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const rideSchema = new Schema(
  {
    UserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    DriverId: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
    },
    pickup: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      min: 0,
    },
    otp: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "completed", "ongoing", "accepted"],
      default: "pending",
    },
    PaymentId: {
      type: String,
    },
    duration: {
      type: String,
    },
    distance: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ride", rideSchema);
