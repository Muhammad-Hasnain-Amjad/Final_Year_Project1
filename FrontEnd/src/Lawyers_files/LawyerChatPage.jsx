// src/Lawyers_files/LawyerChatPage.jsx  ← LAWYER SIDE

import React from "react";
import { Routes, Route } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import ChatList from "../Components/Chat/ChatList";
import ChatWindow from "../Components/Chat/ChatWindow";

// You can swap NavBar with your LawyerNavBar if you have one
// import LawyerNavBar from "../Components/LawyerNavBar";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-950 text-center px-8">
    <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
      <FiMessageCircle className="w-8 h-8 text-yellow-400" />
    </div>
    <h3 className="text-white font-semibold text-lg mb-1">Client Messages</h3>
    <p className="text-gray-500 text-sm">Select a conversation to reply to a client</p>
  </div>
);

const LawyerChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* <LawyerNavBar /> */}

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-0 rounded-2xl border border-gray-800/60 overflow-hidden"
          style={{ height: "calc(100vh - 72px)" }}
        >
          {/* LEFT: Chat list - same API, lawyer JWT auto-filters their chats */}
          <div className="border-r border-gray-800/60 overflow-hidden">
            <ChatList basePath="/lawyer-chats" />
          </div>

          {/* RIGHT: Conversation */}
          <div className="overflow-hidden">
            <Routes>
              <Route index element={<EmptyState />} />
              <Route
                path=":chatId"
                element={<ChatWindow backPath="/lawyer-chats" />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerChatPage;
