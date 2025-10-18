import api from "./api";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.token || res.data.access_token;
  if (!token) throw new Error("No token returned from backend");
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(res.data.user ?? null));
  return res.data;
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
}
