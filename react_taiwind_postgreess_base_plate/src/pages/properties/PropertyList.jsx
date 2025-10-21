import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';

const API_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch(`${API_URL}/properties/list.php`);
                const data = await response.json();
                if (data.status === 'success') {
                    setProperties(data.properties || []);
                } else {
                    throw new Error(data.message || 'Failed to fetch properties');
                }
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-lg text-gray-600">Loading properties...</div>
        </div>
    );

    if (error) return (
        <div className="p-4 text-red-500 bg-red-50 rounded-md m-4">
            <h2 className="font-bold">Error Loading Properties</h2>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Property Listings</h1>
                <Link
                    to="/dashboard/properties/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Add Property
                </Link>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No properties found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard 
                            key={property.property_ID} 
                            property={property} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
