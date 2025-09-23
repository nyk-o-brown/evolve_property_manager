import { Outlet, Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ borderRight: '1px solid #eee', padding: 16 }}>
        <h2>Evolve PM</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/dashboard/properties">Properties</Link></li>
            <li><Link to="/dashboard/tenants">Tenants</Link></li>
            <li><Link to="/dashboard/payments/history">Payments</Link></li>
            <li><Link to="/dashboard/maintenance">Maintenance</Link></li>
            <li><Link to="/dashboard/reports">Reports</Link></li>
            <li><Link to="/dashboard/settings">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}


