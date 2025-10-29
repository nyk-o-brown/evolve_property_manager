import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function ListUnit() {
  const navigate = useNavigate();
  const { propertyId, unitId } = useParams(); // ✅ 1. Extract from URL

  const [formValues, setFormValues] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const [unitDetails, setUnitDetails] = useState(null); // optional
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ✅ 2. Optional: Fetch unit details for display
  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await fetch(`${API_URL}/get_units.php?id=${propertyId}`);
        const data = await res.json();
        const unit = data.units?.find(u => u.unit_ID === unitId || u.unit_ID === Number(unitId));
        setUnitDetails(unit || null);
      } catch (err) {
        console.error('Failed to fetch unit details:', err);
      }
    };
    fetchUnit();
  }, [propertyId, unitId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  setSuccess(false);

  if (!unitDetails) {
    setError('Unit details not loaded.');
    setSubmitting(false);
    return;
  }

  const payload = {
    // Tenant info
    user_name: formValues.user_name,
    email: formValues.email,
    phone_number: formValues.phone_number || null,
    emergency_contact_name: formValues.emergency_contact_name || null,
    emergency_contact_phone: formValues.emergency_contact_phone || null,

    // Unit + property info
    unit_ID: unitId,
    property_ID: propertyId,
    unit_name: unitDetails.unit_name,
    rent_price: unitDetails.rent_price,
    lease_start_date: unitDetails.lease_start_date,
    lease_end_date: unitDetails.lease_end_date,
    security_deposit: unitDetails.security_deposit
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

    if (result?.status === 'success') {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/tenants'), 1500);
    } else {
      throw new Error(result?.message || 'Unknown server response');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};


  const handleCancel = () => navigate(-1);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Register New Tenant</h1>
        <p className="text-gray-600">Assign a tenant to Unit #{unitId} of Property #{propertyId}.</p>
        {unitDetails && (
          <div className="text-sm text-gray-500 mt-2">
            <p><strong>Unit:</strong> {unitDetails.unit_name}</p>
            <p><strong>Rent:</strong> ${unitDetails.rent_price}</p>
            <p><strong>Lease:</strong> {unitDetails.lease_start_date} to {unitDetails.lease_end_date}</p>
          </div>
        )}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                name="user_name"
                value={formValues.user_name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phone_number"
                value={formValues.phone_number}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
              <input
                name="emergency_contact_name"
                value={formValues.emergency_contact_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
              <input
                name="emergency_contact_phone"
                value={formValues.emergency_contact_phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {submitting ? 'Submitting...' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
