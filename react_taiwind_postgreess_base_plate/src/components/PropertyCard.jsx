// src/components/properties/PropertyCard.jsx
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  // ensure we have a property object (fallback if someone passes spread props)
  const p = property || {};
  const id = p.property_ID ?? p.id;
  const title = p.property_name ?? p.title;
  const img = p.image_URL ?? p.image;
  const location = p.location ?? p.address;
  const price = p.price ?? p.rent ?? p.price;

  if (!id) {
    // defensive: render a placeholder if no id (avoid breaking links)
    return (
      <div className="border rounded-lg shadow-md p-4">
        <div className="w-full h-40 bg-gray-100 rounded-md" />
        <h2 className="text-lg font-bold mt-2">Unknown property</h2>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={img || "/placeholder.jpg"}
        alt={title || "Property"}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-bold mt-2">{title}</h2>
      <p className="text-sm text-gray-600">{location}</p>
      <p className="text-blue-600 font-semibold">${price}</p>
      <Link
        to={`/dashboard/properties/${id}/units`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Units
      </Link>
    </div>
  );
}
