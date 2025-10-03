import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Phone, Mail } from "lucide-react";

// Dummy data for the tenants
const dummyTenants = [
  {
    id: "t1",
    name: "John Doe",
    House_Number: "7h",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    status: "Active",
    leaseEnd: "2024-12-31",
  },
  {
    id: "t2",
    name: "Jane Smith",
    House_Number: "9j",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    status: "Active",
    leaseEnd: "2025-06-30",
  },
  {
    id: "t3",
    name: "Peter Jones",
    House_Number: "7d",
    email: "peter.jones@example.com",
    phone: "555-123-4567",
    status: "Pending",
    leaseEnd: "2024-03-15",
  },
];

export default function TenantsList({ theme = "light" }) {
  const [tenants] = useState(dummyTenants);
  const isDarkTheme = theme === "dark";

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Link
          to="/dashboard/tenants/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <p>No tenants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3">Tenant Name</th>
                <th className="px-6 py-3">House_Number</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Lease End</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tenants.map((tenant) => (
                <tr
                  key={tenant.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{tenant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tenant.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        tenant.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tenant.leaseEnd}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/dashboard/tenants/${tenant.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
