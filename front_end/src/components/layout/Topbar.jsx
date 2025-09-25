// src/components/layout/Topbar.jsx

import { Search } from "lucide-react";

export default function Topbar({ theme = "light" }) {
  const isDarkTheme = theme === "dark";

  const topbarClasses = isDarkTheme
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-800 border-b border-gray-200";

  const searchContainerClasses = isDarkTheme
    ? "bg-black text-gray-400"
    : "bg-white text-gray-400 border border-gray-300";

  const searchIconClasses = isDarkTheme
    ? "bg-gray-800 text-gray-400"
    : "bg-gray-100 text-gray-600";

  return (
    <header
      className={`h-14 flex items-center justify-between px-6 ${topbarClasses}`}
    >
      <div className="text-xl font-bold">Dashboard</div>

      {/* Search Bar */}
      <div
        className={`flex items-center w-96 rounded-full overflow-hidden ${searchContainerClasses}`}
      >
        <input
          type="text"
          placeholder="Text here..."
          className={`w-full py-2 px-4 text-sm focus:outline-none ${
            isDarkTheme ? "bg-black text-white" : "bg-white text-gray-800"
          }`}
        />
        <div className={`p-2 cursor-pointer ${searchIconClasses}`}>
          <Search size={20} />
        </div>
      </div>

      {/* Profile/User Icons (Original content, moved to the right) */}
      <div className="flex items-center gap-4">
        <img
          src="/avatar.png"
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
        <button className="text-sm font-medium hover:text-gray-900 dark:hover:text-gray-100">
          Logout
        </button>
      </div>
    </header>
  );
}
