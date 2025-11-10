// src/components/MessageFeed.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const MessageFeed = ({ endpoint = "messages" }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // ✅ endpoint = "messages" by default → calls /api/messages
        const res = await api.get(`/${endpoint}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Message feed error:", err.response?.data || err.message);
        setError("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [endpoint]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">Team Feed</h3>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {messages.length > 0 ? (
        <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {messages.map((msg, idx) => (
            <li key={idx} className="py-2">
              <p className="font-medium text-gray-800">{msg.sender_name}</p>
              <p className="text-sm text-gray-600">{msg.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No messages yet.</p>
      )}
    </div>
  );
};

export default MessageFeed;
