const express = require("express");
const dotenv = require("dotenv");
const connectToDatabase = require("./config/db");
const app = express();
dotenv.config();
connectToDatabase();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on the port ${process.env.PORT}`);
});
