import React, { useState } from 'react';
import './FichajeManual.css';

function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function FichajeManual({ token, user, onFichaje }) {
  const [tipo, setTipo] = useState('entrada');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState(() => new Date().toISOString().slice(11, 16));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const fechas = getDatesInRange(startDate, endDate);
    let ok = 0, fail = 0, solapados = 0;
    // Obtener fichajes existentes del usuario en el rango
    let existentes = [];
    try {
      const res = await fetch(`http://localhost:8000/fichajes/by_user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors'
      });
      if (res.ok) {
        existentes = await res.json();
      }
    } catch {}
    for (const fecha of fechas) {
      const timestamp = `${fecha.toISOString().slice(0, 10)}T${hora}`;
      // Verificar si ya existe fichaje de ese tipo en ese día/hora
      const yaExiste = existentes.some(f => f.tipo === tipo && f.timestamp.startsWith(fecha.toISOString().slice(0, 10)));
      if (yaExiste) {
        solapados++;
        continue;
      }
      try {
        const res = await fetch('http://localhost:8000/fichajes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: user.id, tipo, timestamp }),
          credentials: 'include',
          mode: 'cors'
        });
        if (res.ok) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }
    let msg = '';
    if (ok > 0) msg += `Fichajes registrados: ${ok}. `;
    if (fail > 0) msg += `Errores: ${fail}. `;
    if (solapados > 0) msg += `Solapados (ya existían): ${solapados}.`;
    setSuccess(msg);
    if (onFichaje) onFichaje();
  };

  return (
    <form className="fichaje-manual" onSubmit={handleSubmit}>
      <h3>Fichaje múltiple por periodo</h3>
      <select value={tipo} onChange={e => setTipo(e.target.value)}>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>
      <label>Fecha inicio:</label>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <label>Fecha fin:</label>
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <label>Hora:</label>
      <input type="time" value={hora} onChange={e => setHora(e.target.value)} />
      <button type="submit">Registrar periodo</button>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </form>
  );
}
