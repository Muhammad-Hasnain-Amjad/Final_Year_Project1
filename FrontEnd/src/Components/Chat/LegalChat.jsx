// Components/FloatingLegalChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaWindowMinimize } from 'react-icons/fa';
import api from "../config/api";

export default function LegalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "👋 Hello! I'm your legal assistant. Ask me anything about Pakistan law.\n\nExamples:\n• What is the punishment for theft?\n• How to file for divorce?\n• What are property transfer laws?"
        }
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${api}/chats/ask`, {
        question: input
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.reply
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-yellow-500 text-black rounded-full p-4 shadow-lg hover:bg-yellow-400 transition-all duration-300 group"
      >
        <FaRobot className="w-6 h-6 group-hover:scale-110 transition" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gray-900 rounded-2xl shadow-2xl border border-yellow-500/30 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaRobot className="text-black" />
          <h3 className="font-semibold text-black">Legal Assistant</h3>
          <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full">Online</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-black hover:text-gray-800"
          >
            <FaWindowMinimize />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-black hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a legal question..."
                rows="1"
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50"
              >
                <FaPaperPlane />
              </button>
            </div>
            <p className="text-gray-600 text-xs text-center mt-2">
              ⚠️ General legal info only. Consult a lawyer for specific cases.
            </p>
          </div>
        </>
      )}
    </div>
  );
}