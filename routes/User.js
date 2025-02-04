const express = require("express");
const User = require("../models/User");
const { body } = require("express-validator");
const userController = require("../controllers/User");
const isAuth = require("../middleware/userAuth");
const router = express.Router();
router.post(
  "/signup",
  [
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long")
      .trim(),
    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long")
      .trim(),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address")
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            return Promise.reject("Email already exists");
          }
        } catch (error) {
          return Promise.reject("Error checking email in database");
        }
      }),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long")
      .trim()
      .custom((value, { req }) => {
        if (value === req.body.email) {
          throw new Error("Password cannot be the same as email");
        }
        return true;
      }),
  ],
  userController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("password")
      .exists()
      .withMessage("Password is required")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long"),
  ],
  userController.login
);
router.get("/current_user", isAuth, userController.currentUser);
router.get("/logout", isAuth, userController.logout);
module.exports = router;
