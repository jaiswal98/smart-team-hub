import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow p-4">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
        Smart Team Hub
      </h1>
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white cursor-pointer" />
        <FaUserCircle className="text-3xl text-gray-600 dark:text-gray-200" />
      </div>
    </header>
  );
}
