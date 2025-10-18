import React, { useState } from 'react';
import { login } from './auth';

export default function LoginTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setMsg('Logged in successfully');
      console.log('login response:', data);
      // redirect to dashboard or fetch protected data here
    } catch (err) {
      setMsg(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Test Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
