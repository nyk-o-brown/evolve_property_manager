import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Tenant navigation items
  const tenantNavItems = [
    { path: '/tenant-dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/tenant-dashboard/properties', label: 'My Property', icon: '🏢' },
    { path: '/tenant-dashboard/payments', label: 'Payments', icon: '💳' },
    { path: '/tenant-dashboard/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/tenant-dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  // Manager navigation items
  const managerNavItems = [
    { path: '/manager-dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/manager-dashboard/properties', label: 'Properties', icon: '🏢' },
    { path: '/manager-dashboard/tenants', label: 'Tenants', icon: '👥' },
    { path: '/manager-dashboard/payments', label: 'Payments', icon: '💳' },
    { path: '/manager-dashboard/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/manager-dashboard/reports', label: 'Reports', icon: '📊' },
    { path: '/manager-dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  const navItems = role === 'manager' ? managerNavItems : tenantNavItems;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            {role === 'manager' ? 'Property Manager' : 'Tenant Portal'}
          </h1>
          <p className="text-sm text-gray-600">
            Welcome, {user?.name || 'User'}
          </p>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Role: <span className="font-medium capitalize">{role}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;