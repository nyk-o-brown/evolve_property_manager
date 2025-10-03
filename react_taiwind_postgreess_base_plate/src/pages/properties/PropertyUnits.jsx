// src/pages/properties/PropertyUnits.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api/properties';

export default function PropertyUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Gets :id from URL

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await fetch(`${API_URL}/get_units.php?id=${id}`);
                const data = await response.json();
                if (data.status === 'success') {
                    setUnits(data.units);
                } else {
                    throw new Error(data.message || 'Failed to fetch units');
                }
            } catch (err) {
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
                                    Unit {unit.unit_number}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    unit.status === 'occupied'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-medium">Rent:</span> ${unit.rent_price}/month
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-medium">Tenant:</span> {unit.tenant_name || 'Vacant'}
                                </p>
                                <p className={`text-gray-600 ${
                                    unit.maintenance_status === 'pending'
                                        ? 'text-yellow-600'
                                        : unit.maintenance_status === 'in_progress'
                                            ? 'text-blue-600'
                                            : ''
                                }`}>
                                    <span className="font-medium">Maintenance:</span> {unit.maintenance_status}
                                </p>
                            </div>
                            {unit.status === 'vacant' && (
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


