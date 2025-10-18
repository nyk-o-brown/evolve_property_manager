import React, { useState } from "react";
import { login, logout } from "../auth";
import api from "../api";

const TestDashboard = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [unitName, setUnitName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("auth_token")
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsLoggedIn(true);
      setMessage("✅ Logged in successfully!");
    } catch (err) {
      setMessage("❌ Login failed. Check credentials or backend.");
    }
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/units/add", {
        property_ID: 1,
        unit_name: unitName,
        rent_price: 25000,
        tenant_status: "unoccupied",
      });
      setMessage(`✅ Unit '${unitName}' added successfully.`);
      setUnitName("");
    } catch (err) {
      setMessage("❌ Failed to add unit. Check token or backend.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setMessage("🚪 Logged out.");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Property Manager Test</h2>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "100%" }}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div>
          <form onSubmit={handleAddUnit}>
            <input
              type="text"
              placeholder="Unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              style={{ display: "block", marginBottom: 10, width: "100%" }}
            />
            <button type="submit">Add Unit</button>
          </form>
          <button onClick={handleLogout} style={{ marginTop: 10 }}>
            Logout
          </button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default TestDashboard;