const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

// Database
const DBConnection = require("./Config/DB_Config.js");

// Routes
const { lawyerrouter } = require("./App/Routes/Lawyerroute.js");
const Drrouter = require("./App/Routes/Drroute.js");
const userRouter = require("./App/Routes/userRouter.js");
const chatRouter = require("./App/Routes/Chat/chatRoute.js");
const commentRoutes = require("./App/Routes/commentRoutes.js");
const appointmentRoutes = require("./App/Routes/appointmentroutes.js");

// Socket handler
const { initializeSocket } = require("./Sockets/socketServer.js");

const app = express();

// =====================================
// Allowed Frontend Origins
// =====================================

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [
      "http://localhost:5173",
      "http://localhost:5174"
    ];

console.log("✅ Allowed Origins:", allowedOrigins);

// =====================================
// Middleware
// =====================================

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman/server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error(`CORS blocked: ${origin}`)
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  })
);

// =====================================
// API Routes
// =====================================

app.use("/lawyer", lawyerrouter);
app.use("/doctor", Drrouter);
app.use("/user", userRouter);
app.use("/comments", commentRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/chats", chatRouter);

// =====================================
// HTTP Server
// =====================================

const server = http.createServer(app);

// =====================================
// Socket.IO
// =====================================

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

initializeSocket(io);

// =====================================
// Database + Start Server
// =====================================

const PORT = process.env.PORT || 5000;

DBConnection();

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Socket.IO connected`);
});