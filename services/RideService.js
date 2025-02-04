const MapService = require("../services/MapService");
const crypto = require("crypto");
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
module.exports = { getFare, getOtp };
