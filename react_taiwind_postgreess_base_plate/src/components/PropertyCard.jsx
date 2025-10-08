// src/components/properties/PropertyCard.jsx
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  const p = property || {};
  const id = p.property_ID ?? p.id ?? null;
  const title = p.property_name ?? p.title ?? "Untitled";
  const img = p.image_URL ?? p.image ?? "/placeholder.jpg";
  const location = p.location ?? p.address ?? "";
  const price = p.price ?? p.rent ?? 0;

  if (!id) {
    return (
      <div className="border rounded-lg shadow-md p-4">
        <img
          src={img}
          alt={title}
          className="w-full h-40 object-cover rounded-md"
        />
        <h2 className="text-lg font-bold mt-2">{title}</h2>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-blue-600 font-semibold">${price}</p>
        <button
          disabled
          className="mt-4 inline-block bg-gray-300 text-white px-4 py-2 rounded opacity-60"
        >
          View Units
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg shadow-md p-4">
      <img
        src={img}
        alt={title}
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
