import React from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Property Manager Dashboard</h1>
        <p className="text-gray-600">Manage your properties and tenants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Properties</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-gray-600 text-sm">3 vacant</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Tenants</h3>
          <p className="text-2xl font-bold text-green-600">24</p>
          <p className="text-gray-600 text-sm">All paid this month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">$28,500</p>
          <p className="text-gray-600 text-sm">+5% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance</h3>
          <p className="text-2xl font-bold text-orange-600">8 Open</p>
          <p className="text-gray-600 text-sm">3 urgent</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link
          to="/manager-dashboard/properties"
          className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
        >
          <div className="font-semibold">Properties</div>
        </Link>
        <Link
          to="/manager-dashboard/tenants"
          className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors"
        >
          <div className="font-semibold">Tenants</div>
        </Link>
        <Link
          to="/manager-dashboard/payments"
          className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
        >
          <div className="font-semibold">Payments</div>
        </Link>
        <Link
          to="/manager-dashboard/maintenance"
          className="bg-orange-500 text-white p-4 rounded-lg text-center hover:bg-orange-600 transition-colors"
        >
          <div className="font-semibold">Maintenance</div>
        </Link>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Recent Properties</h3>
          <Link to="/manager-dashboard/properties" className="text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Sunset Apartments #304</p>
              <p className="text-sm text-gray-600">$1,200/month • 2 bed, 1 bath</p>
            </div>
            <span className="text-green-600 font-semibold">Occupied</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Downtown Loft #501</p>
              <p className="text-sm text-gray-600">$1,800/month • 1 bed, 1 bath</p>
            </div>
            <span className="text-red-600 font-semibold">Vacant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;