import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenantForm from '../../components/TenantForm';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export default function TenantCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/tenant/create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        navigate('/dashboard/tenants');
      } else {
        throw new Error(data.message || 'Failed to create tenant');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Tenant</h1>
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      <TenantForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}