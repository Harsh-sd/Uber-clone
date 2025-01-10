const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const connectToDatabase = require("./config/db");
const userRoutes = require("./routes/User");
const driverRoutes = require("./routes/Driver");
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
//prefix with /users ,/drivers
app.use("/users", userRoutes);
app.use("/drivers", driverRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on the port ${process.env.PORT}`);
});
