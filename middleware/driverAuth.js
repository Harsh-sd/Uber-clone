const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

const driverAuth = async (req, res, next) => {
  try {
    //console.log("Request Headers:", req.headers.authorization);
    // console.log(req.cookies.drivertoken);
    //if we use token then there is no need to provide authorization in header
    const token = req.headers.authorization;
    // console.log("Token in middleware:", token); // Log the token
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token not found", success: false });
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // Attaching the decoded data to the req object
    req.id = decodedToken.driverId;
    // console.log(" Extracted driverId:", req.id);
    next();
  } catch (error) {
    console.log("Internal server error:", error.message);
    res.status(500).json({
      message: "An error occurred while verifying the token",
      success: false,
    });
  }
};
module.exports = driverAuth;
