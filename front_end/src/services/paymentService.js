const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8000/api';

export async function collectPayment(payload) {
  const res = await fetch(`${API_URL}/payments/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Failed to collect payment');
  return res.json();
}

export async function fetchPaymentHistory(params = '') {
  const res = await fetch(`${API_URL}/payments/history${params}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch payment history');
  return res.json();
}

export async function fetchInvoice(id) {
  const res = await fetch(`${API_URL}/payments/invoices/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch invoice');
  return res.json();
}


