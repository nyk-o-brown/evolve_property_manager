const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchTenants() {
  const res = await fetch(`${API_URL}/tenants`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch tenants');
  return res.json();
}

export async function fetchTenant(id) {
  const res = await fetch(`${API_URL}/tenants/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch tenant');
  return res.json();
}


