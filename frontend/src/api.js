export const API_URL = 'https://control-horario-2e2a.onrender.com';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password })
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

// <-- AÑADIDA NUEVA FUNCIÓN
export async function getFichajesByUser(token, userId) {
  const res = await fetch(`${API_URL}/fichajes/by_user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
    mode: 'cors'
  });
  if (!res.ok) throw new Error('Error al obtener fichajes');
  return await res.json();
}
