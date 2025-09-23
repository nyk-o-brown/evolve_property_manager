import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import PropertyList from './pages/dashboard/properties/PropertyList.jsx';
import PropertyDetail from './pages/dashboard/properties/PropertyDetail.jsx';
import PropertyCreate from './pages/dashboard/properties/PropertyCreate.jsx';
import PropertyEdit from './pages/dashboard/properties/PropertyEdit.jsx';
import TenantList from './pages/dashboard/tenants/TenantList.jsx';
import TenantProfile from './pages/dashboard/tenants/TenantProfile.jsx';
import PaymentCollect from './pages/dashboard/payments/PaymentCollect.jsx';
import PaymentHistory from './pages/dashboard/payments/PaymentHistory.jsx';
import InvoiceDetail from './pages/dashboard/payments/InvoiceDetail.jsx';
import MaintenanceList from './pages/dashboard/maintenance/MaintenanceList.jsx';
import MaintenanceRequest from './pages/dashboard/maintenance/MaintenanceRequest.jsx';
import MaintenanceTrack from './pages/dashboard/maintenance/MaintenanceTrack.jsx';
import ReportsDashboard from './pages/dashboard/reports/ReportsDashboard.jsx';
import SettingsPage from './pages/dashboard/settings/SettingsPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />}>          
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyCreate />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />

          <Route path="tenants" element={<TenantList />} />
          <Route path="tenants/:id" element={<TenantProfile />} />

          <Route path="payments/collect" element={<PaymentCollect />} />
          <Route path="payments/history" element={<PaymentHistory />} />
          <Route path="payments/invoices/:id" element={<InvoiceDetail />} />

          <Route path="maintenance" element={<MaintenanceList />} />
          <Route path="maintenance/request" element={<MaintenanceRequest />} />
          <Route path="maintenance/track" element={<MaintenanceTrack />} />

          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


