const Message = require("../App/Models/Chat/Message");
const Chat = require("../App/Models/Chat/Chat");
const jwt = require("jsonwebtoken");

// Store connected sockets
const userSockets = new Map();     // userId -> socketId
const lawyerSockets = new Map();   // lawyerId -> socketId

// Helper function
async function sendOnlineStatus(userId, userType, isOnline, io) {
  try {
    const chats = await Chat.find({ participants: userId });

    for (const chat of chats) {
      const otherParticipantId = chat.participants.find(
        p => p.toString() !== userId.toString()
      );

      const otherIndex = chat.participants.findIndex(
        p => p.toString() !== userId.toString()
      );

      const otherParticipantType = chat.participantModels[otherIndex];

      const receiverSocketId =
        otherParticipantType === "User"
          ? userSockets.get(otherParticipantId.toString())
          : lawyerSockets.get(otherParticipantId.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-status", {
          userId,
          userType,
          isOnline,
          lastSeen: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error sending online status:", error);
  }
}

const initializeSocket = (io) => {

  // 🔐 AUTH MIDDLEWARE
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // ✅ USE YOUR jwtkey (AS YOU WANT)
      const decoded = jwt.verify(token, process.env.jwtkey);

      socket.userId = decoded.id || decoded._id;
      socket.userType = decoded.type || decoded.role || "User";

      console.log("Socket authenticated:", socket.userId);
      next();

    } catch (err) {
      console.error("Socket authentication error:", err.message);
      next(new Error("Invalid token"));
    }
  });

  // 🔌 CONNECTION
  io.on("connection", (socket) => {
    console.log(`✅ Connected: ${socket.userId} (${socket.userType})`);

    // store socket
    if (socket.userType === "User") {
      userSockets.set(socket.userId, socket.id);
    } else {
      lawyerSockets.set(socket.userId, socket.id);
    }

    socket.join(`user_${socket.userId}`);

    sendOnlineStatus(socket.userId, socket.userType, true, io);

    // 📌 JOIN CHAT
    socket.on("join-chat", (chatId) => {
      socket.join(`chat_${chatId}`);
    });

    // 📌 LEAVE CHAT
    socket.on("leave-chat", (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    // 📌 SEND MESSAGE
    socket.on("send-message", async (data) => {
      try {
        const {
          chatId,
          receiverId,
          receiverType,
          message,
          messageType = "text",
        } = data;

        const newMessage = await Message.create({
          chatId,
          senderId: socket.userId,
          senderModel: socket.userType,
          receiverId,
          receiverModel: receiverType,
          message,
          messageType,
          deliveredAt: new Date(),
        });

        await Chat.findByIdAndUpdate(chatId, {
          lastMessage: message,
          lastMessageTime: new Date(),
          lastMessageSender: socket.userId,
          $inc: { [`unreadCount.${receiverId}`]: 1 },
        });

        const receiverSocketId =
          receiverType === "User"
            ? userSockets.get(receiverId)
            : lawyerSockets.get(receiverId);

        const payload = {
          _id: newMessage._id,
          chatId,
          message,
          messageType,
          createdAt: newMessage.createdAt,
          sender: {
            id: socket.userId,
            type: socket.userType,
          },
        };

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("new-message", payload);
        }

        socket.emit("message-sent", {
          success: true,
          messageId: newMessage._id,
        });

      } catch (err) {
        console.error("Send message error:", err.message);
      }
    });

    // 📌 TYPING
    socket.on("typing", ({ chatId, receiverId, isTyping }) => {
      const receiverSocketId =
        userSockets.get(receiverId) || lawyerSockets.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          chatId,
          userId: socket.userId,
          isTyping,
        });
      }
    });

    // 📌 READ
    socket.on("mark-read", async ({ chatId, messageIds }) => {
      try {
        await Message.updateMany(
          { _id: { $in: messageIds }, receiverId: socket.userId },
          { isRead: true, readAt: new Date() }
        );

        await Chat.findByIdAndUpdate(chatId, {
          $set: { [`unreadCount.${socket.userId}`]: 0 },
        });

        socket.emit("messages-read", { chatId });

      } catch (err) {
        console.error("Mark read error:", err.message);
      }
    });

    // 📌 DISCONNECT
    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.userId}`);

      if (socket.userType === "User") {
        userSockets.delete(socket.userId);
      } else {
        lawyerSockets.delete(socket.userId);
      }

      sendOnlineStatus(socket.userId, socket.userType, false, io);
    });
  });

  return io;
};

module.exports = { initializeSocket, userSockets, lawyerSockets };