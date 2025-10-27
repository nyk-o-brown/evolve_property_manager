import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TenantForm({ onSubmit, isLoading }) {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    property_id: '',
    unit_id: '',
    lease_start_date: '',
    lease_end_date: '',
    monthly_rent: '',
    deposit_amount: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  const [availableUnits, setAvailableUnits] = useState([]);
  const [error, setError] = useState('');

  // Fetch properties for dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties/get_properties');
        const data = await response.json();
        if (data.status === 'success') {
          setProperties(data.properties);
        }
      } catch (err) {
        setError('Failed to load properties');
      }
    };
    fetchProperties();
  }, []);

  // Fetch available units when property is selected
  useEffect(() => {
    if (formData.property_id) {
      const fetchUnits = async () => {
        try {
          const response = await fetch(`http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties/get_units.php?id=${formData.property_id}&status=unoccupied`);
          const data = await response.json();
          if (data.status === 'success') {
            setAvailableUnits(data.units);
          }
        } catch (err) {
          setError('Failed to load units');
        }
      };
      fetchUnits();
    }
  }, [formData.property_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
      navigate('/dashboard/tenants');
    } catch (err) {
      setError(err.message || 'Failed to create tenant');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name*
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name*
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Property Assignment */}
        <div>
          <label htmlFor="property_id" className="block text-sm font-medium text-gray-700">
            Property*
          </label>
          <select
            id="property_id"
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property.property_ID} value={property.property_ID}>
                {property.property_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700">
            Unit*
          </label>
          <select
            id="unit_id"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={!formData.property_id}
          >
            <option value="">Select a unit</option>
            {availableUnits.map(unit => (
              <option key={unit.unit_ID} value={unit.unit_ID}>
                {unit.unit_name} - ${unit.rent_price}/month
              </option>
            ))}
          </select>
        </div>

        {/* Lease Information */}
        <div>
          <label htmlFor="lease_start_date" className="block text-sm font-medium text-gray-700">
            Lease Start Date*
          </label>
          <input
            type="date"
            id="lease_start_date"
            name="lease_start_date"
            value={formData.lease_start_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="lease_end_date" className="block text-sm font-medium text-gray-700">
            Lease End Date*
          </label>
          <input
            type="date"
            id="lease_end_date"
            name="lease_end_date"
            value={formData.lease_end_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="deposit_amount" className="block text-sm font-medium text-gray-700">
            Security Deposit
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="deposit_amount"
              name="deposit_amount"
              value={formData.deposit_amount}
              onChange={handleChange}
              className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
            Emergency Contact Name
          </label>
          <input
            type="text"
            id="emergency_contact"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            id="emergency_phone"
            name="emergency_phone"
            value={formData.emergency_phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard/tenants')}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Creating...' : 'Add Tenant'}
        </button>
      </div>
    </form>
  );
}