const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function login(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Login failed'));
  return res.json();
}

export async function register(payload) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Register failed'));
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw await res.json().catch(() => new Error('Logout failed'));
  return res.json();
}


