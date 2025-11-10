// src/pages/TechDashboard.jsx
import React, { useState } from "react";
import axios from "axios";
import MessageFeed from "../components/CommunicationFeed";
import { useNavigate } from "react-router-dom";

const TechDashboard = () => {
  const [update, setUpdate] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/tech/update",
        { content: update },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdate("");
      alert("Update posted!");
    } catch (err) {
      console.error(err);
      alert("Failed to post update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          🧑‍💻 Tech Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <MessageFeed endpoint="tech/messages" />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Post Update
          </h3>
          <form onSubmit={handlePostUpdate}>
            <textarea
              value={update}
              onChange={(e) => setUpdate(e.target.value)}
              placeholder="Share your work update..."
              className="w-full border p-2 rounded mb-3"
              rows="4"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TechDashboard;
