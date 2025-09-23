const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchProperties() {
  const res = await fetch(`${API_URL}/properties`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch properties');
  return res.json();
}

export async function fetchProperty(id) {
  const res = await fetch(`${API_URL}/properties/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch property');
  return res.json();
}

export async function createProperty(payload) {
  const res = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to create property');
  return res.json();
}

export async function updateProperty(id, payload) {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to update property');
  return res.json();
}

export async function deleteProperty(id) {
  const res = await fetch(`${API_URL}/properties/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to delete property');
  return res.json();
}


