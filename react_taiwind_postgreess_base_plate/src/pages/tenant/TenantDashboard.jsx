import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export default function TenantDashboard() {
  const [tenant, setTenant] = useState(null);
  const [unit, setUnit] = useState(null);
  const [rentStatus, setRentStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await fetch(`${API_URL}/tenant/dashboard.php?id=${1}`); // Replace 1 with actual tenant ID
        const data = await response.json();
        if (data.status === 'success') {
          setTenant(data.tenant);
          setUnit(data.unit);
          setRentStatus(data.rentStatus);
          setNotifications(data.notifications);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);

  const handlePayRent = async (amount) => {
    try {
      const response = await fetch(`${API_URL}/tenant/pay-rent.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenant_id: tenant.id,
          unit_id: unit.id,
          amount: amount
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setRentStatus(data.rentStatus);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMaintenanceRequest = async (description) => {
    try {
      const response = await fetch(`${API_URL}/tenant/maintenance-request.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenant.id,
          unit_id: unit.id,
          description: description
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNotifications([...notifications, data.notification]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Tenant Info */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Your Unit Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Property: {unit?.property_name}</p>
            <p className="text-gray-600">Unit Number: {unit?.unit_number}</p>
          </div>
          <div>
            <p className="text-gray-600">Monthly Rent: ${unit?.rent_price}</p>
            <p className="text-gray-600">Status: {rentStatus?.status}</p>
          </div>
        </div>
      </div>

      {/* Rent Payment Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Rent Payment</h2>
        <div className="flex items-center gap-4">
          <input 
            type="number"
            className="border rounded p-2"
            placeholder="Enter amount"
            id="rentAmount"
          />
          <button 
            onClick={() => handlePayRent(document.getElementById('rentAmount').value)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Pay Rent
          </button>
        </div>
      </div>

      {/* Maintenance Request Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Maintenance Request</h2>
        <textarea
          id="maintenanceDescription"
          className="w-full border rounded p-2 mb-4"
          rows="4"
          placeholder="Describe the issue..."
        ></textarea>
        <button 
          onClick={() => handleMaintenanceRequest(document.getElementById('maintenanceDescription').value)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Request
        </button>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications</p>
        ) : (
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li key={notification.id} className="py-4">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-gray-600">{notification.message}</p>
                <p className="text-sm text-gray-400">{notification.created_at}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}