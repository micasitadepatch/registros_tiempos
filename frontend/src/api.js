// URL del backend en HTTPS (Correcto para producción)
export const API_URL = 'https://apiregtp.micasitadepatch.com';

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const errorDetail = await res.json().catch(() => ({ detail: 'Credenciales incorrectas' }));
    throw new Error(errorDetail.detail);
  }
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

export async function getFichajesByUser(token, userId) {
  const res = await fetch(`${API_URL}/fichajes/by_user/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
    mode: 'cors'
  });
  if (!res.ok) throw new Error('Error al obtener fichajes');
  return await res.json();
}
