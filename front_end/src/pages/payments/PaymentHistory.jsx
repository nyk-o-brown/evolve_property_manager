import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";

// Dummy data for payment records
const dummyPayments = [
  {
    id: "p1",
    tenantName: "John Doe",
    property: "123 Main St",
    amount: 1500,
    status: "Paid",
    date: "2023-09-20",
    invoiceId: "INV-001",
  },
  {
    id: "p2",
    tenantName: "Jane Smith",
    property: "456 Oak Ave",
    amount: 1200,
    status: "Paid",
    date: "2023-09-18",
    invoiceId: "INV-002",
  },
  {
    id: "p3",
    tenantName: "Peter Jones",
    property: "789 Pine Rd",
    amount: 1800,
    status: "Pending",
    date: "2023-09-15",
    invoiceId: "INV-003",
  },
];

export default function PaymentHistory({ theme = "light" }) {
  const [payments] = useState(dummyPayments);
  const isDarkTheme = theme === "dark";

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3">Tenant</th>
                <th className="px-6 py-3">Property</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Invoice ID</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.tenantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.invoiceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/payments/${payment.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
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
