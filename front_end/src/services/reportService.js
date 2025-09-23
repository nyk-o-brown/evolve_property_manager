const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchReportsOverview() {
  const res = await fetch(`${API_URL}/reports/overview`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch reports overview');
  return res.json();
}


