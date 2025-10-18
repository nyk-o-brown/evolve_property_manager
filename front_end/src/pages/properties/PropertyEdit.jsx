/* eslint-disable no-undef */
// src/pages/properties/PropertyEdit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
/* import { getProperty, updateProperty } from "../../services/propertyService"; */
import PropertyForm from "../../components/PropertyForm";

export default function PropertyEdit() {
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

  const handleUpdate = async (data) => {
    try {
      await updateProperty(id, data);
      navigate(`/properties/${id}`);
    } catch (err) {
      console.error("❌ Failed to update property:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!property) return <p className="p-4">Property not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Property</h1>
      <PropertyForm onSubmit={handleUpdate} defaultValues={property} />
    </div>
  );
}
