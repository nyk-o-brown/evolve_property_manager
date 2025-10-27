import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Assuming the API path is similar to your units endpoint
const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function ListUnit() {
      
  const navigate = useNavigate();
  
  // State to hold the new tenant/user data
  const [formValues, setFormValues] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    // Payload matches the required fields in create_user.php
    const payload = {
      user_name: formValues.user_name,
      email: formValues.email,
      phone_number: formValues.phone_number || null,
      emergency_contact_name: formValues.emergency_contact_name || null,
      emergency_contact_phone: formValues.emergency_contact_phone || null
    };

    try {
      const res = await fetch(`${API_URL}/create_user.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get('content-type') || '';
      const result = contentType.includes('application/json') ? await res.json() : null;

      if (!res.ok) {
        const message = result?.message || `Request failed (HTTP ${res.status})`;
        throw new Error(message);
      }

      if (result && result.status === 'success') {
        setSuccess(true);
        // Navigate to a tenants list page or show a success message
        setTimeout(() => {
          // You might want to navigate to a page where you can now list a unit to this new user
          navigate('/dashboard/tenants'); // Example redirect
        }, 1500);
      } else if (result) {
        throw new Error(result.message || 'Unknown server response');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/tenants');
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the previous page or a main tenants/dashboard page
    navigate(-1); 
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Register New Tenant</h1>
        <p className="text-gray-600">Enter the new tenant's details to create a user account.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Tenant account created successfully! Redirecting...
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            {/* User Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                name="user_name"
                value={formValues.user_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Tenant's Full Name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="tenant@example.com"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone_number"
                type="tel"
                value={formValues.phone_number}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="(123) 456-7890"
              />
            </div>

            {/* Emergency Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Name
              </label>
              <input
                name="emergency_contact_name"
                value={formValues.emergency_contact_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Contact Person"
              />
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Phone
              </label>
              <input
                name="emergency_contact_phone"
                type="tel"
                value={formValues.emergency_contact_phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="(987) 654-3210"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Create Tenant'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}