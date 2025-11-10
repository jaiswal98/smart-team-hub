// src/pages/TechnicianDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const TechnicianDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get("/tasks/my");
      setTasks(res.data);
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await api.put(`/tasks/${id}/status`, { status: newStatus });
    const res = await api.get("/tasks/my");
    setTasks(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">👷 Technician Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">My Tasks</h3>
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500">{task.status}</p>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="border rounded p-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
