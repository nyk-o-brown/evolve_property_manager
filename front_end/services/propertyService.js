// src/services/propertyService.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/properties"; // adjust for your backend

// attach token if needed
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProperties = (params = {}) =>
  axios.get(API_URL, { headers: authHeader(), params });

export const getProperty = (id) =>
  axios.get(`${API_URL}/${id}`, { headers: authHeader() });

export const createProperty = (data) =>
  axios.post(API_URL, data, { headers: authHeader() });

export const updateProperty = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });

export const deleteProperty = (id) =>
  axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
