const Ride = require("../models/Ride");
const MapService = require("../services/MapService");
const { sendMessageToSocketId } = require("../socket");
const RideService = require("../services/RideService");
module.exports = {
  createRide: async (req, res) => {
    try {
      const { user, pickup, destination, vehicleType } = req.body;
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
        user: req.id,
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
        12
      );
      console.log("Drivers found in radius:", driversInRadius);

      await ride.save();
      // Remove OTP after saving the ride
      ride.otp = "";

      // Populate user details
      const rideWithUser = await Ride.findOne({ _id: ride.id }).populate(
        "user",
        "fullName socketId"
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
  confirmRide: async (req, res) => {
    const { rideId, driverId } = req.body;

    try {
      console.log("Confirming ride for ID:", rideId, "Driver:", driverId);

      const ride = await RideService.confirmRide({
        rideId,
        driverId: driverId,
      });

      if (!ride) {
        console.log(" Ride not found or couldn't be confirmed.");
        return res
          .status(404)
          .json({ message: "Ride not found or already confirmed" });
      }

      console.log(" Ride confirmed:", ride);

      // Ensure user has a valid socket ID
      if (!ride.user || !ride.user.socketId) {
        console.log(" User socketId not found:", ride.user);
        return res.status(400).json({ message: "User not connected" });
      }

      // Ensure driver has a valid socket ID
      if (!ride.driver || !ride.driver.socketId) {
        console.log(" Driver socketId not found:", ride.driver);
        //return res.status(400).json({ message: "driver not connected" });
      }

      console.log(" Sending ride confirmation to user:", ride.user.socketId);
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });

      console.log(
        " Sending ride confirmation to driver:",
        ride.driver?.socketId
      );
      sendMessageToSocketId(ride.driver?.socketId, {
        event: "ride-confirmed",
        data: ride,
      });

      return res.status(200).json(ride);
    } catch (err) {
      console.log(" Error in confirmRide:", err);
      return res.status(500).json({ message: err.message });
    }
  },
  startRide: async (req, res) => {
    const { rideId, otp } = req.query;

    try {
      const ride = await RideService.startRide({
        rideId,
        otp,
        driverId: req.id,
      });

      console.log("Updated Ride Status:", ride.status);

      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });

      return res.status(200).json(ride);
    } catch (err) {
      console.error("Error starting ride:", err.message);
      return res.status(500).json({ message: err.message });
    }
  },
  finishRide: async (req, res) => {
    const { rideId } = req.body;

    try {
      const ride = await RideService.finishRide({
        rideId,
        driverId: req.id,
      });

      console.log("Updated Ride Status:", ride.status);

      if (ride.user?.socketId) {
        sendMessageToSocketId(ride.user.socketId, {
          event: "ride-finished",
          data: ride,
        });
      } else {
        console.warn("User socket ID is missing, cannot send real-time event.");
      }

      return res.status(200).json(ride);
    } catch (err) {
      console.error("Error finishing ride:", err.message);
      return res.status(500).json({ message: err.message });
    }
  },
};
