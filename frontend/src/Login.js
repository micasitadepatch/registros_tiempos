import React, { useState, useEffect } from 'react';
import './FichajesList.css';

export default function Login({ onLogin, error }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(() => setUsersList([]));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8e6ee',
    }}>
      <h1 style={{
        color: '#2e8b57',
        fontWeight: 'bold',
        fontSize: '2rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        letterSpacing: '1px',
      }}>
        Registros tiempos empleados<br />Mi Casita de Patch
      </h1>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px #c23a5c22',
        padding: '2.5rem 2rem 2rem 2rem',
        maxWidth: 350,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <img src="https://www.micasitadepatch.com/image/data/logo-micasitadepatch.png" alt="Logo Mi Casita de Patch" style={{height: 90, marginBottom: 18}} />
        <h2 style={{color:'#c23a5c', fontWeight:'bold', marginBottom: '1.2rem', textAlign:'center', fontSize:'1.3rem', letterSpacing:'1px'}}>Acceso al sistema</h2>
        <form style={{width:'100%', display:'flex', flexDirection:'column', gap: '1.1rem'}} onSubmit={e => {
          e.preventDefault();
          onLogin(user.trim(), pass);
        }}>
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={e => setUser(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: 8,
              border: '2px solid #c23a5c',
              fontSize: '1rem',
              outline: 'none',
              marginBottom: '0.5rem',
            }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={e => setPass(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: 8,
              border: '2px solid #c23a5c',
              fontSize: '1rem',
              outline: 'none',
              marginBottom: '0.5rem',
            }}
          />
          <button type="submit" style={{
            background: '#c23a5c',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #c23a5c22',
            transition: 'background 0.2s, color 0.2s',
          }}>Entrar</button>
        </form>
        {error && <div style={{color:'#c23a5c', marginTop:'1rem', fontWeight:'bold', textAlign:'center'}}>{error}</div>}
      </div>
    </div>
  );
}
