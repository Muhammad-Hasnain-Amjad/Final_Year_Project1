// src/Pages/Chat/ChatPage.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { ChatProvider } from "../../Context/ChatContext";  // ✅ Keep this
import ChatList from "../../Components/Chat/ChatList";
import ChatWindow from "../../Components/Chat/ChatWindow";
import NavBar from "../../Components/NavBar";

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">

          {/* Chat List */}
          <div className="lg:col-span-1 bg-black/30 rounded-2xl border border-gray-800 overflow-hidden">
            <ChatList />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 bg-black/30 rounded-2xl border border-gray-800 overflow-hidden">
            <Routes>
              <Route
                index
                element={
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <FiMessageCircle className="w-10 h-10 text-yellow-400" />
                    <h3 className="text-xl text-white mt-3">
                      Select a conversation
                    </h3>
                  </div>
                }
              />
              <Route path=":chatId" element={<ChatWindow />} />
            </Routes>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;