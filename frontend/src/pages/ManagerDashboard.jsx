// src/pages/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import MessageFeed from "../components/CommunicationFeed";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const [announcement, setAnnouncement] = useState("");
  const [tasks, setTasks] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ✅ Load tasks + technicians on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, techRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/users"),
        ]);
        setTasks(tasksRes.data);
        setTechnicians(techRes.data.filter((u) => u.role === "technician"));
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  // ✅ Create and assign new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", { title, assigned_to: assignedTo });
      setTitle("");
      setAssignedTo("");
      alert("✅ Task created successfully");
      // reload task list
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Create task error:", err.response?.data || err.message);
      alert("Failed to create task");
    }
  };

  // ✅ (Optional) Send an announcement
  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post("/messages", { content: announcement });
      setAnnouncement("");
      alert("Announcement sent successfully!");
    } catch (err) {
      console.error("Announcement error:", err.response?.data || err.message);
      alert("Failed to send announcement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          👨‍💼 Manager Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left panel: messages + tasks */}
        <div className="col-span-2 space-y-6">
          <MessageFeed endpoint="messages" />

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Current Tasks
            </h3>
            {tasks.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="py-2 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Assigned to: {task.technician_name || "Unassigned"}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        task.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks yet.</p>
            )}
          </div>
        </div>

        {/* Right panel: create task + announcement */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Create Task
            </h3>
            <form onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded mb-3"
                required
              />
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full border p-2 rounded mb-3"
                required
              >
                <option value="">Select Technician</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Assign Task
              </button>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Send Announcement
            </h3>
            <form onSubmit={handleSendAnnouncement}>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Write announcement..."
                className="w-full border p-2 rounded mb-3"
                rows="4"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ManagerDashboard;
