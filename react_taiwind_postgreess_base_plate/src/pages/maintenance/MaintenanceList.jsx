import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, CheckCircle, Clock } from "lucide-react";

export default function MaintenanceList({ theme = "light" }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDarkTheme = theme === "dark";

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} />;
      case "In Progress":
        return <Wrench size={16} />;
      case "Pending":
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/maintenance/get_requests.php"
        );
        const data = await res.json();
        if (Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          setRequests([]);
        }
      } catch (err) {
        setError("Failed to load maintenance requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <Link
          to="/dashboard/maintenance/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + New Request
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {requests.map((request) => (
            <li key={request.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Wrench size={24} className="text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <div className="text-base font-semibold">{request.issue}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {request.property} · Submitted on {request.submittedDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold leading-5 rounded-full ${getStatusClasses(
                    request.status
                  )}`}
                >
                  {getStatusIcon(request.status)}
                  <span className="ml-1">{request.status}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
