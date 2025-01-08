const express = require("express");
const driverController = require("../controllers/Driver");
const driverAuth = require("../middleware/driverAuth");
const router = express.Router();
router.post("/registerDriver", driverController.registerDriver);
router.post("/login", driverController.loginDriver);
router.get("/currentDriver", driverAuth, driverController.currentDriver);
router.get("/logout", driverAuth, driverController.logout);
module.exports = router;
