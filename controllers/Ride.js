const Ride = require("../models/Ride");
const MapService = require("../services/MapService");
const RideService = require("../services/RideService");
module.exports = {
  createRide: async (req, res) => {
    try {
      const { pickup, destination, vehicleType } = req.body;
      if (!pickup || !destination || !vehicleType) {
        return res.status().json({
          message: "Add all the credentials required for ride",
          success: false,
        });
      }
      /*const distancetime = await MapService.getDistanceTime(
        pickup,
        destination
      );
      if (!distancetime || !distancetime.distance || !distancetime.duration) {
        console.log("Invalid distancetime:", distancetime);
        return res.status(400).json({
          message: "Invalid distance or duration data",
          success: false,
        });
      }
      console.log("distancetime", distancetime.distance);*/

      const fare = await RideService.getFare(pickup, destination);
      console.log(fare);
      if (!fare) {
        return res.status(400).json({
          message: "Error in getting fare from RideService",
          success: false,
        });
      }
      const cost = fare[vehicleType];
      // console.log("cost:", cost);
      const otp = RideService.getOtp(6);
      const ride = new Ride({
        pickup: pickup,
        destination: destination,
        cost: cost,
        otp,
        // duration: distancetime.duration.value / 60,
        // distance: distancetime.distance.value / 1000,
        vehicleType: vehicleType,
      });
      const savedRide = await ride.save();
      res.status(201).json({
        message: "Ride created successfully",
        success: true,
        savedRide,
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
