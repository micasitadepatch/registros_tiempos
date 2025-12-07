import React, { useState, useEffect } from 'react';
import './FichajesList.css';
import { API_URL } from './api'; // <-- CORREGIDO: Importar la URL correcta

export default function CrearEmpleado({ token, onCreated }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [schedule, setSchedule] = useState('10:00-14:00');
  const [autoFichaje, setAutoFichaje] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [token, onCreated]); // Actualizar lista cuando se crea un nuevo usuario

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const res = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, name, password, role, schedule, auto_fichaje: autoFichaje ? 1 : 0 }),
      credentials: 'include',
      mode: 'cors'
    });
    if (res.ok) {
      setUsername(''); setName(''); setPassword(''); setRole('user'); setSchedule('10:00-14:00'); setAutoFichaje(true);
      onCreated(); // Llamar a la función para refrescar la lista principal
    } else {
      const data = await res.json();
      setError(data.detail || 'Error al crear usuario');
    }
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',width:'100%'}}>
      <form onSubmit={handleSubmit} style={{background:'#fff',padding:'2rem',borderRadius:12,boxShadow:'0 2px 16px #c23a5c22',maxWidth:350,width:'100%',margin:'0 auto',display:'flex',flexDirection:'column',gap:'1.2rem',alignItems:'center'}}>
        <h2 style={{color:'#c23a5c',fontWeight:'bold',marginBottom:'1rem'}}>Crear Empleado</h2>
        <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} style={{padding:'10px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'1rem',width:'100%'}} required />
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={{padding:'10px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'1rem',width:'100%'}} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} style={{padding:'10px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'1rem',width:'100%'}} required />
        <select value={role} onChange={e => setRole(e.target.value)} style={{padding:'10px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'1rem',width:'100%'}}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <select value={schedule} onChange={e => setSchedule(e.target.value)} style={{padding:'10px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'1rem',width:'100%'}}>
          <option value="10:00-14:00">Horario 10:00 a 14:00</option>
          <option value="16:00-20:00">Horario 16:00 a 20:00</option>
        </select>
        <label style={{display:'flex',alignItems:'center',gap:'8px',width:'100%',justifyContent:'flex-start'}}>
          <input type="checkbox" checked={autoFichaje} onChange={e => setAutoFichaje(e.target.checked)} />
          Fichaje automático
        </label>
        <button type="submit" style={{background:'#c23a5c',color:'#fff',border:'none',borderRadius:8,padding:'10px 24px',fontWeight:'bold',fontSize:'1rem',cursor:'pointer',width:'100%'}}>Crear</button>
        {error && <div style={{color:'red',marginTop:'8px'}}>{error}</div>}
      </form>
      <div style={{marginTop:'2rem',maxWidth:350,width:'100%',background:'#f8e6ee',borderRadius:10,padding:'1rem',boxShadow:'0 2px 8px #c23a5c22',textAlign:'center'}}>
        <h3 style={{color:'#2e8b57',marginBottom:'1rem'}}>Empleados existentes</h3>
        <ul style={{listStyle:'none',padding:0,margin:0}}>
          {users.map(u => (
            <li key={u.id} style={{marginBottom:'18px',color:'#c23a5c',fontWeight:'bold'}}>
              {u.name} <span style={{color:'#2e8b57'}}>({u.username})</span> - {u.role}
              <br /><span style={{color:'#2e8b57',fontWeight:'normal',fontSize:'0.98em'}}>Horario: {u.schedule}</span>
              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  const res = await fetch(`${API_URL}/users/${u.id}`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ schedule: e.target.elements.schedule.value, auto_fichaje: e.target.elements.auto_fichaje.checked ? 1 : 0 }),
                    credentials: 'include',
                    mode: 'cors'
                  });
                  if (res.ok) {
                    setUsers(users => users.map(us => us.id === u.id ? { ...us, schedule: e.target.elements.schedule.value, auto_fichaje: e.target.elements.auto_fichaje.checked ? 1 : 0 } : us));
                  } else {
                    setError('Error al actualizar el horario');
                  }
                } catch {
                  setError('No se pudo conectar con el servidor');
                }
              }} style={{marginTop:'8px',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                <select name="schedule" defaultValue={u.schedule} style={{padding:'6px',borderRadius:8,border:'2px solid #c23a5c',fontSize:'0.98em'}}>
                  <option value="10:00-14:00">10:00-14:00</option>
                  <option value="16:00-20:00">16:00-20:00</option>
                </select>
                <label style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <input type="checkbox" name="auto_fichaje" defaultChecked={u.auto_fichaje === 1} />
                  Fichaje automático
                </label>
                <button type="submit" style={{background:'#c23a5c',color:'#fff',border:'none',borderRadius:8,padding:'6px 14px',fontWeight:'bold',fontSize:'0.98em',cursor:'pointer'}}>Asignar</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
