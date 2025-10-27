import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function PropertyUnits() {
  const { id } = useParams();
  const propertyId = Number(id);
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [formValues, setFormValues] = useState({
    unit_name: '',
    rent_price: '',
    tenant_status: 'unoccupied',
    lease_start_date: '',
    lease_end_date: '',
    security_deposit: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUnits = async (propertyIdParam) => {
    try {
      setLoading(true);
      const url = `${API_URL}/get_units.php?id=${propertyIdParam}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.status === 'success') {
        // Ensure each unit has property_ID set (fallback to propertyId)
        const normalized = (data.units || []).map(u => ({
          ...u,
          property_ID: u.property_ID ?? propertyIdParam
        }));
        setUnits(normalized);
      } else {
        throw new Error(data.message || 'Failed to fetch units');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  useEffect(() => {
    if (!id || id === 'undefined' || isNaN(propertyId)) {
      setError('Invalid property id in URL.');
      setLoading(false);
      return;
    }
    fetchUnits(propertyId);
  }, [id]);

  const openEdit = (unit) => {
    setEditingUnit(unit);
    setFormValues({
      unit_name: unit.unit_name ?? '',
      rent_price: unit.rent_price ?? '',
      tenant_status: unit.tenant_status ?? 'unoccupied',
      lease_start_date: unit.lease_start_date ?? '',
      lease_end_date: unit.lease_end_date ?? '',
      security_deposit: unit.security_deposit ?? ''
    });
  };

  const closeEdit = () => {
    setEditingUnit(null);
    setFormValues({
      unit_name: '',
      rent_price: '',
      tenant_status: 'unoccupied',
      lease_start_date: '',
      lease_end_date: '',
      security_deposit: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUnit) return;
    setSubmitting(true);
    setError(null);

    const payload = {
      unit_ID: editingUnit.unit_ID,
      // Always send property_ID and keep it unchanged on the server
      property_ID: editingUnit.property_ID ?? propertyId,
      user_ID: editingUnit.user_ID ?? null,
      tenant_ID: editingUnit.tenant_ID ?? null,
      unit_name: formValues.unit_name,
      rent_price: formValues.rent_price,
      tenant_status: formValues.tenant_status,
      lease_start_date: formValues.lease_start_date || null,
      lease_end_date: formValues.lease_end_date || null,
      security_deposit: formValues.security_deposit || null
    };

    try {
      const res = await fetch(`${API_URL}/update_units.php`, {
        method: 'PUT',
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
        await fetchUnits(propertyId);
        closeEdit();
      } else if (result) {
        throw new Error(result.message || 'Unknown server response');
      } else {
        await fetchUnits(propertyId);
        closeEdit();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading property units...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Units</h1>
        <button
          onClick={() => navigate(`/dashboard/properties/${id}/units/create`)}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <span>+</span>
          Create New Unit
        </button>
      </div>
       

      {units.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No units found for this property.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <div
              key={unit.unit_ID}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{unit.unit_name}</h3>
                  <p className="text-sm text-gray-500">Property ID: <span className="font-medium">{unit.property_ID}</span></p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    unit.tenant_status === 'occupied'
                      ? 'bg-red-100 text-red-800'
                      : unit.tenant_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {String(unit.tenant_status).charAt(0).toUpperCase() +
                    String(unit.tenant_status).slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Rent:</span> ${unit.rent_price}/month
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">User:</span> {unit.user_name ?? '—'}
                </p>
                {unit.tenant_status === 'occupied' && (
                  <>
                    <p className="text-gray-600">
                      <span className="font-medium">Lease:</span>{' '}
                      {unit.lease_start_date ?? '—'} to {unit.lease_end_date ?? '—'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Security Deposit:</span>{' '}
                      {unit.security_deposit ?? '—'}
                    </p>
                  </>
                )}
              </div>

              {unit.tenant_status === 'occupied' && (
                <button
                  className="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200"
                  onClick={() => openEdit(unit)}
                >
                  Update Unit
                </button>
              )}

              {unit.tenant_status === 'unoccupied' && (
                <Link to="/dashboard/properties/list-unit">
                  <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
                    List Unit
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {editingUnit && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Edit Unit: {editingUnit.unit_name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show property_ID as read-only text and include a hidden input to ensure it's submitted */}
              <div className="p-2 border rounded bg-gray-100 col-span-1 md:col-span-2">
                <label className="text-sm text-gray-600">Property ID</label>
                <div className="font-medium">{editingUnit.property_ID ?? propertyId}</div>
                <input type="hidden" name="property_ID" value={editingUnit.property_ID ?? propertyId} />
              </div>

              <input
                name="unit_name"
                value={formValues.unit_name}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Unit Name"
                required
              />
              <input
                name="rent_price"
                type="number"
                step="0.01"
                value={formValues.rent_price}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Rent Price"
                required
              />
              <select
                name="tenant_status"
                value={formValues.tenant_status}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="occupied">Occupied</option>
                <option value="pending">Pending</option>
                <option value="unoccupied">Unoccupied</option>
              </select>
              <input
                name="lease_start_date"
                type="date"
                value={formValues.lease_start_date || ''}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                name="lease_end_date"
                type="date"
                value={formValues.lease_end_date || ''}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                name="security_deposit"
                type="number"
                step="0.01"
                value={formValues.security_deposit || ''}
                onChange={handleChange}
                className="p-2 border rounded"
                placeholder="Security Deposit"
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="ml-3 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
