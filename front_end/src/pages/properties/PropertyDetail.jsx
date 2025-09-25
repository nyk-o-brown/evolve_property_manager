// src/pages/properties/PropertyDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProperty, deleteProperty } from "../../../services/propertyService";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getProperty(id);
        setProperty(res.data);
      } catch (err) {
        console.error("❌ Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        navigate("/properties");
      } catch (err) {
        console.error("❌ Failed to delete:", err);
      }
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!property) return <p className="p-4">Property not found.</p>;

  return (
    <div className="p-6 space-y-4">
      <img
        src={property.image || "/placeholder.jpg"}
        alt={property.title}
        className="w-full h-60 object-cover rounded-md"
      />
      <h1 className="text-2xl font-bold">{property.title}</h1>
      <p className="text-gray-600">{property.location}</p>
      <p className="text-lg font-semibold text-blue-600">${property.price}</p>
      <p className="text-sm">{property.description}</p>

      <div className="flex gap-4 mt-4">
        <Link
          to={`/properties/${id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
