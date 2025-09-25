// src/pages/properties/PropertyCreate.jsx
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../../services/propertyService";
import PropertyForm from "../../components/PropertyForm";

export default function PropertyCreate() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await createProperty(data);
      navigate("/properties");
    } catch (err) {
      console.error("❌ Failed to create property:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add New Property</h1>
      <PropertyForm onSubmit={handleCreate} />
    </div>
  );
}
