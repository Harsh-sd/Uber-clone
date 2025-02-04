const express = require("express");
const userAuth = require("../middleware/userAuth");
const rideController = require("../controllers/Ride");
const router = express.Router();
router.post("/create", userAuth, rideController.createRide);
router.get("/fare", userAuth, rideController.getFare);
module.exports = router;
