const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const connectToDatabase = require("./config/db");
const userRoutes = require("./routes/User");
const driverRoutes = require("./routes/Driver");
const mapsRoutes = require("./routes/Maps");
const rideRoutes = require("./routes/Ride");
const app = express();
dotenv.config();
connectToDatabase();
const corsOptions = {
  origin: "http://localhost:5173", //frontend URL
  credentials: true, // Allow credentials  for cookies, authorization
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());
//prefix with /users ,/drivers,/maps,/ridecd backend

app.use("/users", userRoutes);
app.use("/drivers", driverRoutes);
app.use("/maps", mapsRoutes);
app.use("/ride", rideRoutes);

module.exports = app;
