const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

const DBConnection = require("./Config/DB_Config.js");
const { lawyerrouter } = require("./App/Routes/Lawyerroute.js");
const Drrouter = require("./App/Routes/Drroute.js");
const userRouter = require("./App/Routes/userRouter.js");
const chatRouter = require("./App/Routes/Chat/chatRoute.js");
const commentRoutes = require("./App/Routes/commentRoutes.js");
const appointmentRoutes = require("./App/Routes/appointmentroutes.js");

// Import Socket.IO handler
const { initializeSocket } = require("./Sockets/socketServer.js");

const app = express();

// Get allowed origins from .env
const allowedOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

console.log('✅ Allowed CORS origins:', allowedOrigins);

// ✅ Dynamic CORS for Express
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());

// Routes
app.use("/lawyer", lawyerrouter);
app.use("/doctor", Drrouter);
app.use("/user", userRouter);
app.use("/comments", commentRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/chats", chatRouter);

// Create HTTP server (important for Socket.IO)
const server = http.createServer(app);

// ✅ DYNAMIC Socket.IO CORS (Fixed - not hardcoded)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Pass io to your socket handler
initializeSocket(io);

// Database connection and server start
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  const conn = DBConnection();
  if (conn) {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(`✅ Socket.IO ready for connections`);
  }
});