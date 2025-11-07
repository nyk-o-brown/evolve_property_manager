import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_ID: "",
    property_ID: "",
    date: "",
    time: "",
    amount: "",
    description: "",
    account: "",
    month: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/expenses/add_expense.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.status === "success") {
        alert("Expense added successfully");
        navigate("/dashboard/expenses");
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["user_ID", "property_ID", "date", "time", "amount", "description", "account", "month"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace("_", " ")}</label>
            <input
              type={field === "amount" ? "number" : field === "date" ? "date" : field === "time" ? "time" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        ))}
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Submit
        </button>
      </form>
    </div>
  );
}
