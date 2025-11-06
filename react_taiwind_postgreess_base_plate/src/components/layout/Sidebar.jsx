/* eslint-disable no-unused-vars */
// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LayoutGrid,
  Calendar,
  HelpCircle,
  Wrench,
  DollarSign,
} from "lucide-react";

// You would get this from a theme context or state
const currentTheme = "dark"; // Or "light"

const navItems = [
  { to: "/dashboard/properties", label: "Properties", icon: Building2 },
  { to: "/dashboard/tenants", label: "Tenants", icon: Users },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/expenses", label: "Expenses", icon: DollarSign,}
];

export default function Sidebar() {
  const isDarkTheme = currentTheme === "white";

  const sidebarClasses = isDarkTheme
    ? "bg-black"
    : "bg-white border-r border-gray-200";

  const navContainerClasses = isDarkTheme ? "bg-white" : "bg-gray-100";

  const iconBaseClasses = "p-2 rounded-full transition-colors duration-200";
  // Check if the current path is exactly "/dashboard"
  const isDashboardActive = location.pathname === "/dashboard";
  const dashboardLinkClasses = `${iconBaseClasses} ${
    isDashboardActive
      ? isDarkTheme
        ? "bg-black text-white"
        : "bg-gray-800 text-white"
      : isDarkTheme
      ? "text-gray-500 hover:bg-gray-100"
      : "text-gray-600 hover:bg-white"
  }`;
  return (
    <aside
      className={`w-20 min-h-screen flex flex-col items-center py-4 space-y-4 ${sidebarClasses}`}
    >
      {/* Dashboard NavLink */}
      <NavLink to="/dashboard" className={dashboardLinkClasses}>
        <LayoutGrid size={24} />
      </NavLink>

      {/* Main navigation pill */}
      <nav
        className={`flex-1 w-14 rounded-full p-2 flex flex-col items-center space-y-4 ${navContainerClasses}`}
      >
        {navItems.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${iconBaseClasses} ${
                isActive
                  ? isDarkTheme
                    ? "bg-black text-white"
                    : "bg-gray-800 text-white"
                  : isDarkTheme
                  ? "text-gray-500 hover:bg-gray-100"
                  : "text-gray-600 hover:bg-white"
              }`
            }
          >
            <Icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>
      <div
        className={`p-2 rounded-full cursor-pointer transition-colors ${
          isDarkTheme
            ? "text-gray-500 hover:bg-gray-100"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <HelpCircle className="w-6 h-6" />
      </div>
      {/* Bottom icons (Settings & Help) */}
      {/* <div className="flex flex-col items-center space-y-4">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `${iconBaseClasses} ${
              isActive
                ? isDarkTheme
                  ? "bg-black text-white"
                  : "bg-gray-800 text-white"
                : isDarkTheme
                ? "text-gray-500 hover:bg-gray-100"
                : "text-gray-600 hover:bg-white"
            }`
          }
        >
          <Settings className="w-6 h-6" />
        </NavLink>
        <div
          className={`p-2 rounded-full cursor-pointer transition-colors ${
            isDarkTheme
              ? "text-gray-500 hover:bg-gray-100"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <HelpCircle className="w-6 h-6" />
        </div>
      </div> */}
    </aside>
  );
}

/* export default function Sidebar() {
  return (
    <aside className="w-20 min-h-screen bg-black flex flex-col items-center py-4 space-y-4">
      <div className="p-2 rounded-full bg-gray-900 text-white cursor-pointer hover:bg-gray-700 transition-colors">
        <LayoutGrid size={24} />
      </div>

      <nav className="flex-1 w-14 bg-white rounded-full p-2 flex flex-col items-center space-y-4">
        {navItems.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `p-2 rounded-full transition-colors duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col items-center space-y-4">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `p-2 rounded-full transition-colors duration-200 ${
              isActive
                ? "bg-black text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`
          }
        >
          <Settings className="w-6 h-6" />
        </NavLink>
        <div className="p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          <HelpCircle className="w-6 h-6" />
        </div>
      </div>
    </aside>
  );
} */

/* export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        🏠 PropertyApp 
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive ? "bg-gray-700" : "hover:bg-gray-800"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
 */
