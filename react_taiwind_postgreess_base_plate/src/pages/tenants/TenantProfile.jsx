import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Phone, Mail, Home, Calendar, FileText } from "lucide-react";

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/tenant/list.php';

export default function TenantProfile({ theme = "light" }) {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [error, setError] = useState(null);
  const isDarkTheme = theme === "dark";

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch(`${API_URL}?id=${id}`);
        const data = await res.json();

        if (data.status === 'success') {
          setTenant(data.user);
        } else {
          throw new Error(data.message || 'Tenant not found');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTenant();
  }, [id]);

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!tenant) {
    return <div className="p-6">Loading tenant profile...</div>;
  }

  return (
    <div className="p-6">
      <div className={`p-6 rounded-2xl ${cardClasses}`}>
        <h1 className="text-3xl font-bold mb-6">
          Tenant Profile: {tenant.user_name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 mb-2 border-gray-200 dark:border-gray-700">
              Contact Information
            </h2>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">{tenant.email || '—'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">{tenant.phone_number || '—'}</p>
            </div>
          </div>

          {/* Lease Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 mb-2 border-gray-200 dark:border-gray-700">
              Lease Details
            </h2>
            <div className="flex items-center space-x-3">
              <Home size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Property: {tenant.property_name || '—'}, Unit: {tenant.unit_name || '—'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Lease: {tenant.lease_start_date || '—'} to {tenant.lease_end_date || '—'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FileText size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Rent: ${tenant.rent_price || '—'} / month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
