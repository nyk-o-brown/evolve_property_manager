// src/components/layout/Topbar.jsx
import { Search, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Topbar({ theme = "light", onThemeChange }) {
  const navigate = useNavigate();
  const isDarkTheme = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Mock profile picture with fallback
  const ProfileAvatar = () => {
    const [imgError, setImgError] = useState(false);

    if (imgError) {
      return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDarkTheme ? "bg-indigo-600" : "bg-indigo-500"
        }`}>
          <User size={16} className="text-white" />
        </div>
      );
    }

    return (
      <img
        src="/avatar.png"
        alt="User avatar"
        className="w-8 h-8 rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  };

  return (
    <header className={`h-16 flex items-center justify-between px-6 ${
      isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800 border-b border-gray-200"
    }`}>
      <div className="text-xl font-bold">Dashboard</div>

      {/* Search Bar */}
      <div className={`flex items-center w-96 rounded-full ${
        isDarkTheme ? "bg-gray-700 border border-gray-600" : "bg-white border border-gray-300"
      }`}>
        <input
          type="text"
          placeholder="Search here..."
          className={`w-full py-2 px-4 text-sm focus:outline-none rounded-l-full ${
            isDarkTheme ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-800"
          }`}
        />
        <div className={`p-2 cursor-pointer rounded-r-full ${
          isDarkTheme ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}>
          <Search size={20} />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${
            isDarkTheme ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"
          }`}
        >
          {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-3">
          <ProfileAvatar />
          <button 
            onClick={handleLogout}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isDarkTheme 
                ? "bg-gray-700 text-white hover:bg-gray-600" 
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}