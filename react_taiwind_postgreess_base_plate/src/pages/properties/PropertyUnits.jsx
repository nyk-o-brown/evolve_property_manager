// src/pages/properties/PropertyUnits.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export default function PropertyUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // This gets the :id from the URL

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                console.log('Fetching units for property:', id); // Debug log
                const response = await fetch(`${API_URL}/properties/get_units.php?id=${id}`);
                const data = await response.json();
                console.log('Received data:', data); // Debug log
                
                if (data.status === 'success') {
                    setUnits(data.units);
                } else {
                    throw new Error(data.message || 'Failed to fetch units');
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, [id]);

    if (loading) {
        return <div className="p-4">Loading property units...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Property Units</h1>
            {units.length === 0 ? (
                <p>No units found for this property.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {units.map((unit) => (
                        <div 
                            key={unit.id} 
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">
                                    Unit {unit.unit_number}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    unit.status === 'occupied' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {unit.status}
                                </span>
                            </div>
                            <div className="mt-2">
                                <p className="text-gray-600">
                                    Rent: ${unit.rent_price}
                                </p>
                                <p className="text-gray-600">
                                    Tenant: {unit.tenant_name || 'Vacant'}
                                </p>
                                {unit.maintenance_status !== 'none' && (
                                    <p className={`mt-2 ${
                                        unit.maintenance_status === 'pending' 
                                            ? 'text-yellow-600' 
                                            : 'text-blue-600'
                                    }`}>
                                        Maintenance: {unit.maintenance_status}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}