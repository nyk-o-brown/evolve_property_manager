import { useParams } from "react-router-dom";
import { User, Phone, Mail, Home, Calendar, FileText } from "lucide-react";

// Dummy data for all tenants
const dummyTenants = [
  {
    id: "t1",
    name: "John Doe",
    House_Number: "7h",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    status: "Active",
    leaseStart: "2023-01-01",
    leaseEnd: "2024-12-31",
    rentAmount: 1500,
    deposit: 1500,
  },
  {
    id: "t2",
    name: "Jane Smith",
    House_Number: "9j",
    email: "jane.smith@example.com",
    phone: "098-765-4321",
    status: "Active",
    leaseStart: "2023-06-01",
    leaseEnd: "2025-06-30",
    rentAmount: 1200,
    deposit: 1200,
  },
  {
    id: "t3",
    name: "Peter Jones",
    House_Number: "7d",
    email: "peter.jones@example.com",
    phone: "555-123-4567",
    status: "Pending",
    leaseStart: "2023-09-01",
    leaseEnd: "2024-03-15",
    rentAmount: 1800,
    deposit: 1800,
  },
];

export default function TenantProfile({ theme = "light" }) {
  const { id } = useParams();
  const tenant = dummyTenants.find((t) => t.id === id);

  const isDarkTheme = theme === "dark";
  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  if (!tenant) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tenant Not Found</h1>
        <p>Could not find a tenant with the ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className={`p-6 rounded-2xl ${cardClasses}`}>
        <h1 className="text-3xl font-bold mb-6">
          Tenant Profile: {tenant.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 mb-2 border-gray-200 dark:border-gray-700">
              Contact Information
            </h2>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">{tenant.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">{tenant.phone}</p>
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
                Property: {tenant.property}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Lease: {tenant.leaseStart} to {tenant.leaseEnd}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FileText size={20} className="text-gray-500" />
              <p className="text-gray-600 dark:text-gray-400">
                Rent: ${tenant.rentAmount} / month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
