const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchTickets() {
  const res = await fetch(`${API_URL}/maintenance`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch maintenance tickets');
  return res.json();
}

export async function createRequest(payload) {
  const res = await fetch(`${API_URL}/maintenance/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to create maintenance request');
  return res.json();
}


