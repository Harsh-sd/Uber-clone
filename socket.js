const { Server } = require("socket.io");
const User = require("./models/User");
const Driver = require("./models/Driver");
let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`✅ User disconnected: ${socket.id}`);
    });
    socket.on("join", async (data) => {
      const { userType, userId } = data;
      console.log(`User ${userId} signed as ${userType}`);
      if (userType === "User") {
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "Driver") {
        await Driver.findByIdAndUpdate(userId, { socketId: socket.id });
      }
    });
  });
};
const sendMessageToSocketId = (socketId, message) => {
  console.log(message);

  if (io) {
    io.to(socketId).emit("message", message);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
