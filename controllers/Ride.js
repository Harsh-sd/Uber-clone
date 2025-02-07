const Ride = require("../models/Ride");
const MapService = require("../services/MapService");
const { sendMessageToSocketId } = require("../socket");
const RideService = require("../services/RideService");
module.exports = {
  createRide: async (req, res) => {
    try {
      const { userId, pickup, destination, vehicleType } = req.body;
      if (!pickup || !destination || !vehicleType) {
        return res.status(400).json({
          message: "All credentials are required",
          success: false,
        });
      }

      const fare = await RideService.getFare(pickup, destination);
      if (!fare) {
        return res.status(400).json({
          message: "Error in getting fare from RideService",
          success: false,
        });
      }
      const cost = fare[vehicleType];
      const otp = RideService.getOtp(6);

      const ride = new Ride({
        userId: req.id,
        pickup,
        destination,
        cost,
        otp,
        vehicleType,
      });

      // Find coordinates to search for drivers in the radius
      const pickupCoordinates = await MapService.getCoordinates(pickup);
      console.log("Pickup location:", pickup);
      console.log("Pickup coordinates:", pickupCoordinates);

      if (
        !pickupCoordinates ||
        !pickupCoordinates.lat ||
        !pickupCoordinates.lng
      ) {
        return res.status(400).json({
          message: "Invalid pickup location",
          success: false,
        });
      }

      const driversInRadius = await MapService.getDriverInTheRadius(
        pickupCoordinates.lat,
        pickupCoordinates.lng,
        5
      );
      console.log("Drivers found in radius:", driversInRadius);

      // Remove OTP before saving the ride
      ride.otp = "";
      await ride.save();

      // Populate user details
      const rideWithUser = await Ride.findOne({ _id: ride.id }).populate(
        "userId",
        "fullName"
      );

      // Log and send data to nearby drivers via WebSocket
      driversInRadius.forEach((driver) => {
        const rideData = {
          event: "new-ride",
          data: rideWithUser,
        };

        console.log(
          `Sending ride data to driver ${driver.socketId}:`,
          rideData
        );

        sendMessageToSocketId(driver.socketId, rideData);
      });

      res.status(201).json({
        message: "Ride created successfully",
        success: true,
        ride: rideWithUser,
      });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },

  getFare: async (req, res) => {
    try {
      const { pickup, destination } = req.query;
      if (!pickup || !destination) {
        return res.status(400).json({
          message: "pickup and destination are not selected",
          success: false,
        });
      }
      const fare = await RideService.getFare(pickup, destination);
      if (!fare) {
        return res
          .status(400)
          .json({ message: "Fare could not be calculated", success: false });
      }
      res
        .status(200)
        .json({ message: "fare calculated successfully", success: true, fare });
    } catch (error) {
      console.log("Internal server error", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  },
};
