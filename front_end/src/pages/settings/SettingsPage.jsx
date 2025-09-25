/* eslint-disable no-unused-vars */
import { useState } from "react";
import { User, Lock, Bell, Moon } from "lucide-react";

// Dummy data for user profile
const dummyUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Property Manager",
  avatar: "https://via.placeholder.com/150",
};

export default function Settings({ theme = "light" }) {
  const isDarkTheme = theme === "dark";
  const [userProfile, setUserProfile] = useState(dummyUser);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  return (
    <div className={`p-6 space-y-8`}>
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Section */}
      <div className={`p-6 rounded-2xl ${cardClasses}`}>
        <div className="flex items-center space-x-6">
          <img
            src={userProfile.avatar}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {userProfile.email}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {userProfile.role}
            </p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className={`p-6 rounded-2xl ${cardClasses}`}>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          General Settings
        </h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          <li className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-gray-500" />
              <span className="font-medium">Change Profile Information</span>
            </div>
            <button className="text-blue-500 hover:text-blue-700 text-sm">
              Edit
            </button>
          </li>
          <li className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Lock size={20} className="text-gray-500" />
              <span className="font-medium">Change Password</span>
            </div>
            <button className="text-blue-500 hover:text-blue-700 text-sm">
              Change
            </button>
          </li>
          <li className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Bell size={20} className="text-gray-500" />
              <span className="font-medium">Receive Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={isNotificationsEnabled}
              onChange={() =>
                setIsNotificationsEnabled(!isNotificationsEnabled)
              }
              className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
            />
          </li>
        </ul>
      </div>

      {/* Theme Settings */}
      <div className={`p-6 rounded-2xl ${cardClasses}`}>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
          Theme
        </h3>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Moon size={20} className="text-gray-500" />
            <span className="font-medium">Dark Mode</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {isDarkTheme ? "Enabled" : "Disabled"}
          </p>
        </div>
      </div>
    </div>
  );
}
