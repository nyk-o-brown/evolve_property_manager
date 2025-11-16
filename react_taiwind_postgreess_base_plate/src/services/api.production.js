// src/services/api.production.js
// Use this file for cPanel deployment
// IMPORTANT: Before building for production, replace the BASE_URL with your actual domain

const BASE_URL = process.env.REACT_APP_API_URL || 'https://yourdomain.com/api';

export async function apiGet(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
}

export async function apiPost(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
}

export async function apiPut(endpoint, body) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
}

export async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
}
