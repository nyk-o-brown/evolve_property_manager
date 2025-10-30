import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function PaymentHistory({ theme = "light" }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDarkTheme = theme === "dark";

  const cardClasses = isDarkTheme
    ? "bg-gray-800 text-gray-200 shadow-lg"
    : "bg-white text-gray-800 shadow-md";

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          "http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/payments/get_payments.php",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();

        // Expecting data.payments to be an array; adapt if your endpoint returns differently
        if (Array.isArray(data.payments)) {
          setPayments(data.payments);
        } else {
          // fallback: if the endpoint returns the array directly
          setPayments(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError(err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className={`p-6 rounded-2xl ${cardClasses}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading payments…</div>
      ) : error ? (
        <div className="py-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error: {error}
        </div>
      ) : payments.length === 0 ? (
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
                  key={payment.id ?? payment.payment_id ?? payment.invoiceId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.tenant_name ?? payment.tenantName ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.property_address ?? payment.property ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${payment.amount ?? payment.total ?? 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        (payment.status ?? "Pending") === "Paid"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {payment.status ?? "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.date ?? payment.paid_at ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.invoice_id ?? payment.invoiceId ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/payments/${payment.id ?? payment.payment_id ?? payment.invoice_id ?? ""}`}
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
