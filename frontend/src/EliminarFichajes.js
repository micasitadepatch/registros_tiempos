import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './FichajesList.css';

export default function EliminarFichajes({ token }) {
  const [fichajes, setFichajes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/fichajes', {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setFichajes)
      .catch(() => setError('Error al cargar fichajes'));
  }, [token, success]);

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8000/fichajes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors'
      });
      if (!res.ok) throw new Error('Error al eliminar fichaje');
      setSuccess('Fichaje eliminado');
    } catch (err) {
      setError('Error al eliminar fichaje');
    }
  };

  return (
    <div className="fichajes-list">
      <h2 className="verde-titulo">Eliminar Fichajes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empleado</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {error && <tr><td colSpan={5}>{error}</td></tr>}
          {fichajes.length === 0 && !error && (
            <tr><td colSpan={5}>No hay fichajes registrados.</td></tr>
          )}
          {fichajes.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.user_name || f.user_id}</td>
              <td className={f.tipo === 'entrada' ? 'entrada' : 'salida'}>{f.tipo.toUpperCase()}</td>
              <td>{new Date(f.timestamp).toLocaleString()}</td>
              <td>
                <button className="icon-btn" title="Eliminar" onClick={() => handleDelete(f.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
