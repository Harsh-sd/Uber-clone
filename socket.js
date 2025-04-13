const { Server } = require("socket.io");
const User = require("./models/User");
const Driver = require("./models/Driver");
let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allowing all origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(` User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(` User disconnected: ${socket.id}`);
    });
    socket.on("join", async (data) => {
      const { userType, userId } = data;
      console.log(`User ${userId} signed in as ${userType}`);

      let updatedUser;
      if (userType === "User") {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true }
        );
      } else if (userType === "Driver") {
        updatedUser = await Driver.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true }
        );
      }

      console.log(" Updated User/Driver:", updatedUser);
    });

    socket.on("update-driver-location", async (data) => {
      const { driverId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", {
          message: "Location provided is Invalid",
        });
      }

      await Driver.findByIdAndUpdate(driverId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });
  });
};
const sendMessageToSocketId = (socketId, messageObject) => {
  console.log("sendmessage:", messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};
module.exports = { initializeSocket, sendMessageToSocketId };
