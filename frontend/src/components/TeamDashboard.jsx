import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";
import CommunicationFeed from "./CommunicationFeed";
import api from "../api/axiosInstance";

export default function TeamDashboard() {
  const [team, setTeam] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("http://localhost:4000/api/users").then(res => setTeam(res.data));
    api.get("http://localhost:4000/api/tasks").then(res => setTasks(res.data));
  }, []);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="col-span-2">
        <h2 className="text-xl font-semibold mb-4">Active Tasks</h2>
        <div className="grid gap-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          {team.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between py-2 border-b last:border-none border-gray-200 dark:border-gray-700"
            >
              <span>{member.name}</span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  member.status === "online"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {member.status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CommunicationFeed />
        </div>
      </section>
    </div>
  );
}
