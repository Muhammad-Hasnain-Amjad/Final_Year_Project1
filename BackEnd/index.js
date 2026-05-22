const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

// DB connection
const connectDB = require("./Config/DB_Config.js");

// Routes
const { lawyerrouter } = require("./App/Routes/Lawyerroute.js");
const Drrouter = require("./App/Routes/Drroute.js");
const userRouter = require("./App/Routes/userRouter.js");
const chatRouter = require("./App/Routes/Chat/chatRoute.js");
const commentRoutes = require("./App/Routes/commentRoutes.js");
const appointmentRoutes = require("./App/Routes/appointmentroutes.js");

// Socket
const { initializeSocket } = require("./Sockets/socketServer.js");

const app = express();
const server = http.createServer(app);

// =====================
// CORS
// =====================
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : ["https://cureandcounsel.vercel.app"];

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);

// =====================
// Routes
// =====================
app.use("/lawyer", lawyerrouter);
app.use("/doctor", Drrouter);
app.use("/user", userRouter);
app.use("/comments", commentRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/chats", chatRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// =====================
// Socket.IO
// =====================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

initializeSocket(io);

// =====================
// START SERVER AFTER DB
// =====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();