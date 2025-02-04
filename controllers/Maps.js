const MapService = require("../services/MapService");
module.exports = {
  getcoodinates: async (req, res) => {
    try {
      const address = req.query.address;
      console.log(address);
      if (!address) {
        return res
          .status(400)
          .json({ message: "Address not found", success: false });
      }

      const coordinates = await MapService.getCoordinates(address);
      console.log(coordinates);
      if (coordinates) {
        return res.status(200).json({
          success: true,
          coordinates,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch coordinates.",
        });
      }
    } catch (error) {
      console.log("Internl server error", error);
      res
        .status(500)
        .json({ message: "Error in getting the coordinates", success: false });
    }
  },
  getDistanceTime: async (req, res) => {
    const { origin, destination } = req.body;
    try {
      const result = await MapService.getDistanceTime(origin, destination);
      if (result) {
        return res.status(200).json({
          success: true,
          distance: result.distance,
          duration: result.duration,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch distance and time.",
        });
      }
    } catch (error) {
      console.log("Internal server error", error);
      res.status(500).json({
        message: "Error in getting the distance and time",
        success: false,
      });
    }
  },
  getAutoCompleteSuggestions: async (req, res) => {
    const { input } = req.query;
    try {
      const suggestions = await MapService.getAutoCompleteSuggestions(input);
      if (suggestions) {
        return res.status(200).json({
          success: true,
          suggestions,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch autocomplete suggestions.",
        });
      }
    } catch (error) {
      console.log("Internal server error", error);
      res.status(500).json({
        message: "Error in getting autocomplete suggestions",
        success: false,
      });
    }
  },
};
