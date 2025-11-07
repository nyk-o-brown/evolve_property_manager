// src/pages/expenses/ExpensesList.jsx
import React, { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";


const formatCurrency = (value) => {
  if (value == null) return "-";
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(Number(value));
};

const ExpensesList = () => {
  const navigate = useNavigate(); // ✅ This line was missing
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/expenses/expenses.php");
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const json = await res.json();
        if (!cancelled) setExpenses(Array.isArray(json) ? json : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load expenses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
            <p className="text-sm text-gray-500">View and manage recorded expenses</p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/expenses/create")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading expenses...
                  </td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && expenses.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No expenses yet. Click "Add Expense" to create your first record.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                expenses.map((e) => (
                  <tr key={e.expenses_ID}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.date || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.time || "-"}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-md">{e.description || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(e.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.account || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{e.month || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
          Showing <span className="font-medium">{expenses.length}</span> expenses
        </div>
      </div>
    </div>
  );
};

export default ExpensesList;
