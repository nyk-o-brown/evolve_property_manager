/* // src/pages/properties/PropertyList.jsx
import { useEffect, useState } from "react";
import { getProperties } from "../../../services/propertyService";
import PropertyCard from "../../components/PropertyCard";
import { Link } from "react-router-dom";

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProperties();
        setProperties(res.data);
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <Link
          to="properties/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
 */
// src/pages/properties/PropertyList.jsx
//import { useState } from "react";
//import PropertyCard from "../../components/PropertyCard";
//import { Link } from "react-router-dom";

// Dummy data to replace the API call
//const dummyProperties = [
//  {
//    id: "1",
//    image:
//      "https://th.bing.com/th/id/OIP.ZvNO6B5RSezVWUJOOzIplgHaFQ?w=254&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
//    title: "Modern Apartments in Downtown",
//    price: 2500,
//    beds: 2,
//    baths: 2,
//    sqft: 1200,
//    address: "123 Main St, Anytown, USA",
//  },
//  {
//    id: "2",
//    image:
//      "https://th.bing.com/th/id/R.550a4d2f01bbb4882f7cc10564a161c1?rik=uWmZBQMPP1r09w&pid=ImgRaw&r=0",
//    title: "Imara Daima Spring Apartments",
//    price: 3500,
//    beds: 4,
//    baths: 3,
//    sqft: 2500,
//    address: "456 Oak Ave, Anytown, USA",
//  },
//  {
//    id: "3",
//    image:
//      "https://tse1.explicit.bing.net/th/id/OIP.RaQclChyv2XkLtUewvm6OgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
//    title: "Gold Standard Apartments",
//    price: 1800,
//    beds: 1,
//    baths: 1,
//    sqft: 800,
//    address: "789 Pine Rd, Anytown, USA",
//  },
//];

//export default function PropertyList() {
//  const [properties] = useState(dummyProperties);

//  return (
//    <div className="p-6">
//      <div className="flex justify-between items-center mb-4">
//        <h1 className="text-2xl font-bold">Property Listings</h1>
//        <Link
//          to="properties/new"
//          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//        >
//          + Add Property
//        </Link>
//      </div>
//
//      {properties.length === 0 ? (
//        <p>No properties found.</p>
//      ) : (
//        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//          {properties.map((prop) => (
//            <PropertyCard key={prop.id} property={prop} />
//          ))}
//        </div>
//      )}
//    </div>
//}


// src/pages/properties/PropertyList.jsx
import { useState, useEffect } from 'react';
import { propertyService } from '../../services/propertyService';
import PropertyCard from '../../components/PropertyCard';
import { Link } from 'react-router-dom';

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProperties() {
            try {
                console.log('Fetching properties...'); // Debug log
                const data = await propertyService.getAllProperties();
                console.log('Properties received:', data); // Debug log
                setProperties(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProperties();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-lg">Loading properties...</div>
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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Property Listings</h1>
                <Link
                    to="/properties/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    + Add Property
                </Link>
            </div>

            {properties.length === 0 ? (
                <p className="text-gray-500">No properties found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.property_ID ?? property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}