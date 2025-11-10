import React from "react";

export default function TaskCard({ task }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium text-gray-800 dark:text-gray-100">{task.title}</h3>
        <p className="text-sm text-gray-500">{task.description}</p>
      </div>
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          task.status === "completed"
            ? "bg-green-100 text-green-700"
            : task.status === "in-progress"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {task.status}
      </span>
    </div>
  );
}
