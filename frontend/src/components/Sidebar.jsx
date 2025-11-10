import React from "react";
import { FaUsers, FaTasks, FaComments, FaSun, FaMoon } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar() {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col border-r dark:border-gray-700">
      <h2 className="text-lg font-bold mb-6 text-gray-700 dark:text-gray-100">
        Team Menu
      </h2>
      <nav className="flex flex-col gap-4 flex-1">
        <a className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600" href="#">
          <FaUsers /> Team Members
        </a>
        <a className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600" href="#">
          <FaTasks /> Tasks
        </a>
        <a className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600" href="#">
          <FaComments /> Communication Feed
        </a>
      </nav>

      <button
        onClick={toggleTheme}
        className="mt-6 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 py-2 rounded-md"
      >
        {dark ? <FaSun /> : <FaMoon />} {dark ? "Light" : "Dark"} Mode
      </button>
    </aside>
  );
}
