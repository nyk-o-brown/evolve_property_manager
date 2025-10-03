import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetail";
import PropertyCreate from "./pages/properties/PropertyCreate";
import PropertyEdit from "./pages/properties/PropertyEdit";
import PropertyUnits from './pages/properties/PropertyUnits';
import PropertyUnits from './pages/properties/PropertyUnits';



import TenantList from "./pages/tenants/TenantList";
import TenantProfile from "./pages/tenants/TenantProfile";
import PaymentHistory from "./pages/payments/PaymentHistory";
import PaymentCollect from "./pages/payments/PaymentCollect";
import InvoiceDetail from "./pages/payments/InvoiceDetail";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import MaintenanceRequest from "./pages/maintenance/MaintenanceRequest";
import MaintenanceTrack from "./pages/maintenance/MaintenanceTrack";
import ReportsDashboard from "./pages/reports/ReportsDashboard";
import SettingsPage from "./pages/settings/SettingsPage";
import DashboardLayout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties">
            <Route index element={<PropertyList />} />
            <Route path="create" element={<PropertyCreate />} />
            <Route path=":id" element={<PropertyDetail />} />
            <Route path=":id/edit" element={<PropertyEdit />} />
            <Route path=":id/units" element={<PropertyUnits />} />
            <Route path=":id/units" element={<PropertyUnits />} />
            
            


          </Route>
          <Route path="tenants">
            <Route index element={<TenantList />} />
            <Route path=":id" element={<TenantProfile />} />
          </Route>
          <Route path="payments">
            <Route index element={<PaymentHistory />} />
            <Route path="collect" element={<PaymentCollect />} />
            <Route path=":id" element={<InvoiceDetail />} />
          </Route>
          <Route path="maintenance">
            <Route index element={<MaintenanceList />} />
            <Route path="request" element={<MaintenanceRequest />} />
            <Route path=":id" element={<MaintenanceTrack />} />
          </Route>
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
