const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectToDatabase = async (req, res, next) => {
  const connectedDb = await mongoose.connect(process.env.MONGO_URI);
  if (connectedDb) {
    console.log("Database connected successfully");
  } else {
    console.log("Error in connnecting to the database");
  }
};
module.exports = connectToDatabase;
