const MapService = require("../services/MapService");
const crypto = require("crypto");
const Ride = require("../models/Ride");
async function getFare(pickup, destination) {
  try {
    const distanceTime = await MapService.getDistanceTime(pickup, destination);

    // console.log("Full API Response:", distanceTime);
    // console.log("Distance:", distanceTime.distance); // Should be a string like "19.4 km"
    // console.log("Duration:", distanceTime.duration); // Should be a string like "31 mins"

    if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
      throw new Error(
        `Invalid response format: ${JSON.stringify(distanceTime)}`
      );
    }

    // Extract numeric distance (e.g., "19.4 km" -> 19.4)
    const distanceValue = parseFloat(distanceTime.distance);

    // Extract total minutes from duration (e.g., "31 mins" -> 31)
    const durationParts = distanceTime.duration.match(/(\d+)\s*min[s]?/i);
    const durationValue = durationParts ? parseInt(durationParts[1]) : NaN;

    // Validate extracted values
    if (isNaN(distanceValue) || isNaN(durationValue)) {
      throw new Error(
        `Invalid parsed data: distanceValue=${distanceValue}, durationValue=${durationValue}`
      );
    }

    //console.log("Parsed values:", { distanceValue, durationValue });

    // Fare Calculation
    const BasicFare = { Auto: 30, Car: 50, MotorCycle: 10 };
    const perKmRate = { Auto: 10, Car: 15, MotorCycle: 8 };
    const perMinRate = { Auto: 5, Car: 8, MotorCycle: 2 };

    const fare = {
      Auto: Math.round(
        BasicFare.Auto +
          distanceValue * perKmRate.Auto +
          durationValue * perMinRate.Auto
      ),
      Car: Math.round(
        BasicFare.Car +
          distanceValue * perKmRate.Car +
          durationValue * perMinRate.Car
      ),
      MotorCycle: Math.round(
        BasicFare.MotorCycle +
          distanceValue * perKmRate.MotorCycle +
          durationValue * perMinRate.MotorCycle
      ),
    };

    // console.log("Calculated fare:", fare);
    return fare;
  } catch (error) {
    console.error("Error in getFare:", error.message);
    throw error;
  }
}

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}
const confirmRide = async ({ rideId, driverId }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  console.log(" Confirming ride:", rideId, "for driver:", driverId);

  // Update ride status and assign driver
  await Ride.findOneAndUpdate(
    { _id: rideId },
    { status: "accepted", driver: driverId },
    { new: true }
  );

  // Fetch ride with populated user & driver socketId
  const ride = await Ride.findOne({ _id: rideId })
    .populate("user", "fullName socketId")
    .populate("driver", "fullName socketId vehicle.numberPlate")
    .select("+otp");
  if (ride && ride.driver) {
    console.log("Driver Name:", ride.driver.fullName);
    console.log("Number Plate:", ride.driver.vehicle?.numberPlate);
  }
  if (!ride) {
    throw new Error(" Ride not found");
  }

  console.log("Ride confirmed:", ride);
  return ride;
};
const startRide = async ({ rideId, otp, driverId }) => {
  if (!rideId || !otp) {
    throw new Error("Ride ID and OTP are required");
  }

  let ride = await Ride.findOne({ _id: rideId })
    .populate("user")
    .populate("driver")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride cannot be started unless it is accepted");
  }

  ride = await Ride.findOneAndUpdate(
    { _id: rideId },
    { status: "ongoing" },
    { new: true }
  )
    .populate("user")
    .populate("driver");

  if (!ride) {
    throw new Error("Failed to update ride status");
  }

  return ride;
};
const finishRide = async ({ rideId, driverId }) => {
  if (!rideId) {
    throw new Error("Ride ID is required");
  }

  let ride = await Ride.findOne({ _id: rideId })
    .populate("user")
    .populate("driver");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride not ongoing");
  }

  ride = await Ride.findOneAndUpdate(
    { _id: rideId },
    { status: "completed" },
    { new: true }
  )
    .populate("user")
    .populate("driver");

  if (!ride) {
    throw new Error("Ride status update failed");
  }
  return ride;
};
module.exports = { getFare, getOtp, confirmRide, startRide, finishRide };
