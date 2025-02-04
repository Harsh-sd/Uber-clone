const express = require("express");
const isAuth = require("../middleware/userAuth");
const MapsController = require("../controllers/Maps");
const router = express.Router();
router.get("/get-coordinates", isAuth, MapsController.getcoodinates);
router.get("/get-distancetime", isAuth, MapsController.getDistanceTime);
router.get(
  "/get-suggestions",
  isAuth,
  MapsController.getAutoCompleteSuggestions
);
module.exports = router;
