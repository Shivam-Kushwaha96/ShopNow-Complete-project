const app = require("./src/app");
const connectDB = require("./src/config/db");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Socket Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_admin", () => {
    socket.join("admin_room");
    console.log("Admin joined admin_room");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Global io access
global.io = io;

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});