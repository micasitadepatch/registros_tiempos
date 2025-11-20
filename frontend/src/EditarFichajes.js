import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './FichajesList.css';

export default function EditarFichajes({ token }) {
  const [fichajes, setFichajes] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTipo, setEditTipo] = useState('entrada');
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

  const handleEdit = (id, tipo) => {
    setEditId(id);
    setEditTipo(tipo);
    setError('');
    setSuccess('');
  };

  const handleSave = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`http://localhost:8000/fichajes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tipo: editTipo }),
        credentials: 'include',
        mode: 'cors'
      });
      if (!res.ok) throw new Error('Error al editar fichaje');
      setSuccess('Fichaje editado');
      setEditId(null);
    } catch (err) {
      setError('Error al editar fichaje');
    }
  };

  return (
    <div className="fichajes-list">
      <h2 className="verde-titulo">Editar Fichajes</h2>
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
              <td>
                {editId === f.id ? (
                  <select value={editTipo} onChange={e => setEditTipo(e.target.value)}>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                  </select>
                ) : (
                  <span className={f.tipo === 'entrada' ? 'entrada' : 'salida'}>{f.tipo.toUpperCase()}</span>
                )}
              </td>
              <td>{new Date(f.timestamp).toLocaleString()}</td>
              <td>
                {editId === f.id ? (
                  <>
                    <button className="icon-btn" title="Guardar" onClick={() => handleSave(f.id)}><FaSave /></button>
                    <button className="icon-btn" title="Cancelar" onClick={() => setEditId(null)}><FaTimes /></button>
                  </>
                ) : (
                  <button className="icon-btn" title="Editar" onClick={() => handleEdit(f.id, f.tipo)}><FaEdit /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
