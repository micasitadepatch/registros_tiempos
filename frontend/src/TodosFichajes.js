import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './FichajesList.css';
import { API_URL } from './api'; // <-- IMPORTANTE: Usar la URL centralizada

export default function TodosFichajes({ token }) {
  const [fichajes, setFichajes] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTipo, setEditTipo] = useState('entrada');
  const [editSuccess, setEditSuccess] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);

  useEffect(() => {
    // Obtener todos los empleados
    fetch(`${API_URL}/users`, { // <-- CORREGIDO
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setEmpleados)
      .catch(() => setEmpleados([]));
  }, [token]);

  useEffect(() => {
    // Obtener todos los fichajes
    fetch(`${API_URL}/fichajes`, { // <-- CORREGIDO
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setFichajes)
      .catch(() => setError('Error al cargar fichajes'));
  }, [token, editSuccess]);

  // Filtrar fichajes por empleados seleccionados
  const fichajesFiltrados = selectedEmpleados.length > 0
    ? fichajes.filter(f => selectedEmpleados.includes(f.user_id))
    : fichajes;

  const handleEmpleadoSelect = (id) => {
    setSelectedEmpleados(selected =>
      selected.includes(id)
        ? selected.filter(eid => eid !== id)
        : [...selected, id]
    );
  };

  const handleSelectAllEmpleados = () => {
    if (selectedEmpleados.length === empleados.length) {
      setSelectedEmpleados([]);
    } else {
      setSelectedEmpleados(empleados.map(e => e.id));
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setEditSuccess('');
    try {
      const res = await fetch(`${API_URL}/fichajes/${id}`, { // <-- CORREGIDO
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors'
      });
      if (!res.ok) throw new Error('Error al eliminar fichaje');
      setEditSuccess('Fichaje eliminado');
    } catch (err) {
      setError('Error al eliminar fichaje');
    }
  };

  const handleEdit = (id, tipo) => {
    setEditId(id);
    setEditTipo(tipo);
    setError('');
    setEditSuccess('');
  };

  const handleSave = async (id) => {
    setError('');
    setEditSuccess('');
    try {
      const res = await fetch(`${API_URL}/fichajes/${id}`, { // <-- CORREGIDO
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
      setEditSuccess('Fichaje editado');
      setEditId(null);
    } catch (err) {
      setError('Error al editar fichaje');
    }
  };

  return (
    <>
      <h2 className="verde-titulo">Bienvenido, Eva Huercano</h2>
      <div className="empleados-select" style={{marginBottom:'1rem', textAlign:'center'}}>
        <label style={{fontWeight:'bold'}}>Filtrar por empleados:</label>
        <div style={{display:'inline-block', marginLeft:'10px'}}>
          <input type="checkbox" checked={selectedEmpleados.length === empleados.length && empleados.length > 0} onChange={handleSelectAllEmpleados} /> <span style={{marginRight:'10px'}}>Todos</span>
          {empleados.map(e => (
            <label key={e.id} style={{marginRight:'10px'}}>
              <input type="checkbox" checked={selectedEmpleados.includes(e.id)} onChange={() => handleEmpleadoSelect(e.id)} /> {e.name}
            </label>
          ))}
        </div>
      </div>
      <table className="verde-titulo">
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
          {fichajesFiltrados.length === 0 && !error && (
            <tr><td colSpan={5}>No hay fichajes registrados.</td></tr>
          )}
          {fichajesFiltrados.map(f => (
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
                  <>
                    <button className="icon-btn" title="Editar" onClick={() => handleEdit(f.id, f.tipo)}><FaEdit /></button>
                    <button className="icon-btn" title="Eliminar" onClick={() => handleDelete(f.id)}><FaTrash /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
