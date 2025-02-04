const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const http = require("http");
const { initializeSocket } = require("./socket");
const server = http.createServer(app);
initializeSocket(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});
