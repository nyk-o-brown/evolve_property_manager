const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Auth routes
app.post('/api/register', (req, res) => {
  res.json({ message: 'User registered successfully', user: { id: 1, name: req.body.name, email: req.body.email } });
});

app.post('/api/login', (req, res) => {
  res.json({ message: 'Login successful', token: 'mock-jwt-token', user: { id: 1, name: 'Test User', email: req.body.email } });
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Property routes
app.get('/api/properties', (req, res) => {
  res.json({ data: [
    { id: 1, name: 'Sunset Apartments', address: '123 Main St', rent: 1200 },
    { id: 2, name: 'Garden Villa', address: '456 Oak Ave', rent: 1500 }
  ]});
});

app.post('/api/properties', (req, res) => {
  res.status(201).json({ message: 'Property created successfully', data: { id: 3, ...req.body } });
});

app.get('/api/properties/:id', (req, res) => {
  res.json({ data: { id: parseInt(req.params.id), name: 'Sample Property', address: '123 Main St', rent: 1200 } });
});

app.put('/api/properties/:id', (req, res) => {
  res.json({ message: 'Property updated successfully', data: { id: parseInt(req.params.id), ...req.body } });
});

app.delete('/api/properties/:id', (req, res) => {
  res.json({ message: 'Property deleted successfully' });
});

// Tenant routes
app.get('/api/tenants', (req, res) => {
  res.json({ data: [
    { id: 1, name: 'John Doe', email: 'john@example.com', property_id: 1 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', property_id: 2 }
  ]});
});

app.get('/api/tenants/:id', (req, res) => {
  res.json({ data: { id: parseInt(req.params.id), name: 'Sample Tenant', email: 'tenant@example.com' } });
});

// Payment routes
app.post('/api/payments/collect', (req, res) => {
  res.json({ message: 'Payment collected successfully', data: { id: 1, amount: req.body.amount, status: 'completed' } });
});

app.get('/api/payments/history', (req, res) => {
  res.json({ data: [
    { id: 1, amount: 1200, date: '2024-01-01', tenant: 'John Doe' },
    { id: 2, amount: 1500, date: '2024-01-02', tenant: 'Jane Smith' }
  ]});
});

app.get('/api/payments/invoices/:id', (req, res) => {
  res.json({ data: { id: parseInt(req.params.id), amount: 1200, date: '2024-01-01', status: 'paid' } });
});

// Maintenance routes
app.get('/api/maintenance', (req, res) => {
  res.json({ data: [
    { id: 1, title: 'Leaky Faucet', status: 'open', property: 'Sunset Apartments' },
    { id: 2, title: 'Broken Window', status: 'in_progress', property: 'Garden Villa' }
  ]});
});

app.post('/api/maintenance/request', (req, res) => {
  res.status(201).json({ message: 'Maintenance request created', data: { id: 3, ...req.body, status: 'open' } });
});

// Reports routes
app.get('/api/reports/overview', (req, res) => {
  res.json({ data: { 
    totalProperties: 2, 
    totalTenants: 2, 
    monthlyRevenue: 2700, 
    pendingMaintenance: 2 
  }});
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
