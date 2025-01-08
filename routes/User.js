const express = require("express");
const userController = require("../controllers/User");
const isAuth = require("../middleware/userAuth");
const router = express.Router();
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/current_user", isAuth, userController.currentUser);
router.get("/logout", isAuth, userController.logout);
module.exports = router;
