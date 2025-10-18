// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LayoutGrid,
  HelpCircle,
  Wrench,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/dashboard/properties", label: "Properties", icon: Building2 },
  { to: "/dashboard/tenants", label: "Tenants", icon: Users },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ theme = "dark" }) {
  const location = useLocation();
  const isDarkTheme = theme === "dark";

  const sidebarClasses = isDarkTheme
    ? "bg-black"
    : "bg-white border-r border-gray-200";

  const navContainerClasses = isDarkTheme ? "bg-white" : "bg-gray-100";

  const iconBaseClasses = "p-2 rounded-full transition-colors duration-200 flex items-center justify-center";

  return (
    <aside
      className={`w-20 min-h-screen flex flex-col items-center py-4 space-y-4 ${sidebarClasses}`}
    >
      {/* Main navigation pill */}
      <nav
        className={`flex-1 w-14 rounded-full p-2 flex flex-col items-center space-y-4 ${navContainerClasses}`}
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `${iconBaseClasses} ${
                isActive
                  ? isDarkTheme
                    ? "bg-black text-white"
                    : "bg-gray-800 text-white"
                  : isDarkTheme
                  ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  : "text-gray-600 hover:bg-white hover:text-gray-900"
              }`
            }
          >
            <Icon className="w-6 h-6" />
          </NavLink>
        ))}
      </nav>

      {/* Help icon at the bottom */}
      <div
        className={`p-2 rounded-full cursor-pointer transition-colors ${
          isDarkTheme
            ? "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
        }`}
        title="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </div>
    </aside>
  );
}