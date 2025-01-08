const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
        minLength: [3, "first name must be more than 3 characters"],
      },
      lastName: {
        type: String,
        required: true,
        minLength: [3, "last name must be more than 3 characters"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
