import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function UnitCreate() {
  const { id } = useParams();
  const propertyId = Number(id);
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    unit_name: '',
    rent_price: '',
    tenant_status: 'unoccupied',
    lease_start_date: '',
    lease_end_date: '',
    security_deposit: ''
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
    
    if (!id || id === 'undefined' || isNaN(propertyId)) {
      setError('Invalid property ID');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const payload = {
      property_ID: propertyId,
      unit_name: formValues.unit_name,
      rent_price: formValues.rent_price,
      tenant_status: formValues.tenant_status,
      lease_start_date: formValues.lease_start_date || null,
      lease_end_date: formValues.lease_end_date || null,
      security_deposit: formValues.security_deposit || null
    };

    try {
      const res = await fetch(`${API_URL}/create_units.php`, {
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
        // Reset form
        setFormValues({
          unit_name: '',
          rent_price: '',
          tenant_status: 'unoccupied',
          lease_start_date: '',
          lease_end_date: '',
          security_deposit: ''
        });
        
        // Optionally navigate back after a delay
        setTimeout(() => {
          navigate(`/dashboard/properties/${id}/units`);
        }, 1500);
      } else if (result) {
        throw new Error(result.message || 'Unknown server response');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/dashboard/properties/${id}/units`);
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/dashboard/properties/${id}/units`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create New Unit</h1>
        <p className="text-gray-600">Property ID: <span className="font-medium">{propertyId}</span></p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Unit created successfully! Redirecting...
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Name *
              </label>
              <input
                name="unit_name"
                value={formValues.unit_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Unit 101, Apartment A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rent Price * ($/month)
              </label>
              <input
                name="rent_price"
                type="number"
                step="0.01"
                min="0"
                value={formValues.rent_price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1000.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Status
              </label>
              <select
                name="tenant_status"
                value={formValues.tenant_status}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="unoccupied">Unoccupied</option>
                <option value="occupied">Occupied</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease Start Date
              </label>
              <input
                name="lease_start_date"
                type="date"
                value={formValues.lease_start_date || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease End Date
              </label>
              <input
                name="lease_end_date"
                type="date"
                value={formValues.lease_end_date || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Deposit ($)
              </label>
              <input
                name="security_deposit"
                type="number"
                step="0.01"
                min="0"
                value={formValues.security_deposit || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500.00"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Unit'}
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