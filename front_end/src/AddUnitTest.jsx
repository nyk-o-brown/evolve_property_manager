import React, { useState } from 'react';
import api from './api';

export default function AddUnitTest() {
  const [res, setRes] = useState(null);

  async function handleAdd() {
    try {
      const payload = {
        property_ID: 1,
        unit_name: 'Unit A1',
        rent_price: 25000,
        tenant_status: 'unoccupied'
      };
      const r = await api.post('/units/add', payload);
      setRes(r.data);
    } catch (err) {
      setRes({ error: err.response?.data || err.message });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Add Unit (Protected)</h3>
      <button onClick={handleAdd}>Add Unit</button>
      <pre>{JSON.stringify(res, null, 2)}</pre>
    </div>
  );
}
