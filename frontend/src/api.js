// API helper for FastAPI backend

// --- DYNAMIC API URL ---
// This will use localhost for development and the Render URL for production.
const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : 'https://registros-tiempos.onrender.com';
// -----------------------

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    // Permitir credenciales cross-origin
    credentials: 'include',
    mode: 'cors'
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return await res.json();
}

export async function getUsers(token) {
  const res = await fetch(`${API_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
    mode: 'cors'
  });
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return await res.json();
}
// Puedes añadir más funciones para fichajes, etc.
