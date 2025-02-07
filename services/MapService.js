const axios = require("axios");
const Driver = require("../models/Driver");
require("dotenv").config();

async function getCoordinates(address) {
  const apiKey = process.env.GOOGLE_MAPS_API;
  //console.log(apiKey);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    //console.log(response);
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getDistanceTime(origin, destination) {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    //console.log(response);
    if (response.data.status === "OK") {
      const element = response.data.rows[0].elements[0];
      return {
        distance: element.distance.text,
        duration: element.duration.text,
      };
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function getAutoCompleteSuggestions(input) {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions.map(
        (prediction) => prediction.description
      );
    } else {
      throw new Error("Unable to fetch autocomplete suggestions");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
const getDriverInTheRadius = async (ltd, lng, radius) => {
  // radius in km

  const drivers = await Driver.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return drivers;
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getDriverInTheRadius,
};
