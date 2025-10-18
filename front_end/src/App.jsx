import "./App.css";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Import role-specific components
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import TenantDashboard from "./pages/dashboard/TenantDashboard";
import ManagerDashboard from "./pages/dashboard/ManagerDashboard";
import DashboardLayout from "./components/layout/DashboardLayout";

// Manager-specific components
import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetail";
import PropertyCreate from "./pages/properties/PropertyCreate";
import PropertyEdit from "./pages/properties/PropertyEdit";
import TenantList from "./pages/tenants/TenantList";
import PaymentHistory from "./pages/payments/PaymentHistory";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import ReportsDashboard from "./pages/reports/ReportsDashboard";
import SettingsPage from "./pages/settings/SettingsPage";

// Tenant-specific components
import TenantProperties from "./pages/tenants/TenantProperties";
import TenantPayments from "./pages/tenants/TenantPayment";
import TenantMaintenance from "./pages/tenants/TenantMaintenance";
import TenantProfile from "./pages/tenants/TenantProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tenant Dashboard Routes */}
        <Route 
          path="/tenant-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <DashboardLayout role="tenant" />
            </ProtectedRoute>
          }
        >
          <Route index element={<TenantDashboard />} />
          <Route path="properties" element={<TenantProperties />} />
          <Route path="payments" element={<TenantPayments />} />
          <Route path="maintenance" element={<TenantMaintenance />} />
          <Route path="profile" element={<TenantProfile />} />
        </Route>

        {/* Manager Dashboard Routes */}
        <Route 
          path="/manager-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['manager']}>
              <DashboardLayout role="manager" />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />
          {/* Properties */}
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyCreate />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />
          {/* Tenants */}
          <Route path="tenants" element={<TenantList />} />
          {/* Payments */}
          <Route path="payments" element={<PaymentHistory />} />
          {/* Maintenance */}
          <Route path="maintenance" element={<MaintenanceList />} />
          {/* Reports */}
          <Route path="reports" element={<ReportsDashboard />} />
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}