// src/pages/dashboard/Dashboard.jsx
import PropertyProfitGraph from "../../components/PropertyProfitGraph";
import NotificationPanel from "../../components/NotificationPanel";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Almaiza Apartments</h2>
          <PropertyProfitGraph propertyId={1} />
        </div>
      </div>
      <div className="lg:col-span-1">
        <NotificationPanel />
      </div>
    </div>
  );
}
