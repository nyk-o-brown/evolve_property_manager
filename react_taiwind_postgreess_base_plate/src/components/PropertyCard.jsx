// src/components/properties/PropertyCard.jsx
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={property.image || "/placeholder.jpg"}
        alt={property.title}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-bold mt-2">{property.title}</h2>
      <p className="text-sm text-gray-600">{property.location}</p>
      <p className="text-blue-600 font-semibold">${property.price}</p>
      <Link
        to={`/properties/${property.id}/units`}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
        View Units
      </Link>
    </div>
  );
}
