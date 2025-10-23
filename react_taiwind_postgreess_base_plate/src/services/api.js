// src/services/api.js
const BASE_URL = 'http://localhost/evolve_property_manager/react_taiwind_postgreess_base_plate/backend/api';

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  return res.json();
}

export async function apiPost(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}
