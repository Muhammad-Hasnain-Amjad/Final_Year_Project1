const Chat = require("../../Models/Chat/Chat");
const Message = require("../../Models/Chat/Message");
const usermodel = require("../../Models/usermodel");
const lawyermodel = require("../../Models/Lawyermodel");

// Get or create a chat between two users
async function getOrCreateChat(req, res) {
  try {
    const { otherUserId, otherUserType } = req.body;
    const currentUserId = req.user.id;
    const currentUserType = req.user.type;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, otherUserId], $size: 2 }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [currentUserId, otherUserId],
        participantModels: [currentUserType, otherUserType],
        unreadCount: new Map(),
        lastMessage: "",
        lastMessageTime: new Date()
      });
    }

    // Get other participant details
    const otherUser = otherUserType === 'User' 
      ? await usermodel.findById(otherUserId).select('name email')
      : await lawyermodel.findById(otherUserId).select('registration.fullName registration.email registration.profilePic');

    res.status(200).json({
      success: true,
      data: {
        chat,
        otherParticipant: otherUser
      }
    });
  } catch (error) {
    console.error("GetOrCreateChat Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get user's all chats
async function getUserChats(req, res) {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    }).sort({ updatedAt: -1 });

    // Populate other participant details for each chat
    const enrichedChats = await Promise.all(chats.map(async (chat) => {
      const otherParticipantId = chat.participants.find(p => p.toString() !== userId);
      const otherParticipantModel = chat.participantModels[
        chat.participants.findIndex(p => p.toString() !== userId)
      ];

      const otherUser = otherParticipantModel === 'User'
        ? await usermodel.findById(otherParticipantId).select('name email')
        : await lawyermodel.findById(otherParticipantId).select('registration.fullName registration.email registration.profilePic');

      const unreadCount = chat.unreadCount.get(userId) || 0;

      // Get last message details
      const lastMessage = await Message.findOne({ chatId: chat._id })
        .sort({ createdAt: -1 })
        .limit(1);

      // Get other user's name properly
      let otherUserName = "";
      let otherUserEmail = "";
      let otherUserProfilePic = "";

      if (otherParticipantModel === 'User') {
        otherUserName = otherUser?.name || "User";
        otherUserEmail = otherUser?.email || "";
        otherUserProfilePic = otherUser?.profilePic || "";
      } else {
        otherUserName = otherUser?.registration?.fullName || "Lawyer";
        otherUserEmail = otherUser?.registration?.email || "";
        otherUserProfilePic = otherUser?.registration?.profilePic?.url || "";
      }

      return {
        _id: chat._id,
        otherParticipant: {
          _id: otherParticipantId,
          name: otherUserName,
          email: otherUserEmail,
          profilePic: otherUserProfilePic
        },
        lastMessage: lastMessage?.message || chat.lastMessage || "No messages yet",
        lastMessageTime: lastMessage?.createdAt || chat.lastMessageTime,
        lastMessageSender: lastMessage?.senderId?.toString() === userId ? "You" : otherUserName,
        unreadCount,
        isActive: chat.isActive
      };
    }));

    res.status(200).json({
      success: true,
      data: enrichedChats
    });
  } catch (error) {
    console.error("GetUserChats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get messages for a chat with pagination
async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user.id;

    // Verify user is part of this chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this chat"
      });
    }

    let query = { chatId, deletedFor: { $ne: userId } };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Mark messages as delivered
    await Message.updateMany(
      { chatId, receiverId: userId, deliveredAt: null },
      { deliveredAt: new Date() }
    );

    res.status(200).json({
      success: true,
      data: messages.reverse()
    });
  } catch (error) {
    console.error("GetChatMessages Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Mark messages as read
async function markMessagesAsRead(req, res) {
  try {
    const { chatId, messageIds } = req.body;
    const userId = req.user.id;

    await Message.updateMany(
      { _id: { $in: messageIds }, receiverId: userId },
      { isRead: true, readAt: new Date() }
    );

    // Reset unread count for this user in chat
    await Chat.findByIdAndUpdate(chatId, {
      $set: { [`unreadCount.${userId}`]: 0 }
    });

    res.status(200).json({
      success: true,
      message: "Messages marked as read"
    });
  } catch (error) {
    console.error("MarkMessagesAsRead Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getOrCreateChat,
  getUserChats,
  getChatMessages,
  markMessagesAsRead
};