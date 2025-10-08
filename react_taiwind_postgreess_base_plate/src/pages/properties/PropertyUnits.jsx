import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function PropertyUnits() {
  const { id } = useParams();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      setError('Invalid property id in URL.');
      setLoading(false);
      return;
    }

    const fetchUnits = async () => {
      try {
        const propertyId = Number(id);
        const url = `${API_URL}/get_units.php?id=${propertyId}`;
        console.log('Fetching units from', url);
        const response = await fetch(url);
        console.log('Fetch status', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('Units payload', data);
        if (data.status === 'success') {
          setUnits(data.units || []);
        } else {
          throw new Error(data.message || 'Failed to fetch units');
        }
      } catch (err) {
        console.error('Fetch error', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [id]);

  if (loading) return <div className="p-4">Loading property units...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Property Units</h1>
      {units.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No units found for this property.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {unit.unit_name}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  unit.tenant_status === 'occupied'
                    ? 'bg-red-100 text-red-800'
                    : unit.tenant_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {unit.tenant_status.charAt(0).toUpperCase() + unit.tenant_status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Rent:</span> ${unit.rent_price}/month
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">User:</span> {unit.user_name}
                </p>
              </div>
              {unit.tenant_status === 'unoccupied' && (
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
                  List Unit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
