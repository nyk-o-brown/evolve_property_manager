import "./App.css";
import "./index.css"; // ✅ this must exist
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetail";
import PropertyCreate from "./pages/properties/PropertyCreate";
import PropertyEdit from "./pages/properties/PropertyEdit";

import TenantList from "./pages/tenants/TenantList";
import PaymentHistory from "./pages/payments/PaymentHistory";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import ResportsDashboard from "./pages/reports/ReportsDashboard";
import SettingsPage from "./pages/settings/SettingsPage";
import DashboardHome from "./components/layout/DashboardHome";
import DashboardLayout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          {/* Properties */}
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyCreate />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />
          {/* Tenants, Payments, etc. follow same pattern */}
          <Route path="/dashboard/properties" element={<PropertyList />} />
          <Route path="/dashboard/tenants" element={<TenantList />} />
          <Route path="/dashboard/payments" element={<PaymentHistory />} />
          <Route path="/dashboard/maintenance" element={<MaintenanceList />} />
          <Route path="/dashboard/reports" element={<ResportsDashboard />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
