import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import { getUsers, login, getFichajesByUser } from './api'; // <-- CORREGIDO: Importar getFichajesByUser
import Header from './Header';
import Menu from './Menu';
import CrearEmpleado from './CrearEmpleado';
import FichajeManual from './FichajeManual';
import EditarFichajes from './EditarFichajes';
import EliminarFichajes from './EliminarFichajes';
import ExportarDatos from './ExportarDatos';
import ImprimirInforme from './ImprimirInforme';
import TodosFichajes from './TodosFichajes';
import './FichajesList.css';
import Toast from './Toast';

// La función getFichajesByUser se ha movido a api.js

function Dashboard({ token, user, onChangeUser }) {
  const [users, setUsers] = useState([]);
  const [action, setAction] = useState('');
  const [fichajes, setFichajes] = useState([]);
  React.useEffect(() => {
    getUsers(token).then(setUsers).catch(() => setUsers([]));
  }, [token]);

  React.useEffect(() => {
    if (action === 'fichajes') {
      getFichajesByUser(token, user.id).then(setFichajes).catch(() => setFichajes([])); // <-- CORREGIDO: Usa la función importada
    }
  }, [action, token, user]);

  // Diccionario de nombres de sección
  const sectionNames = {
    'fichajes': 'Mis Fichajes',
    'crear': 'Crear Empleado',
    'manual': 'Fichaje Manual',
    'editar': 'Editar Fichajes',
    'eliminar': 'Eliminar Fichajes',
    'todos': 'Fichajes de Todos',
    'exportar': 'Exportar Datos',
    'imprimir': 'Imprimir Informe'
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="perfil-container">
        <img className="perfil-logo" src={user.logo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Perfil" />
        <span style={{fontWeight:'bold', color:'#c23a5c', fontSize:'1.1rem'}}>{user.name}</span>
        <button className="cambiar-usuario-btn" onClick={onChangeUser} title="Cambiar usuario">
          Cambiar usuario
        </button>
      </div>
      <Menu onAction={setAction} role={user.role} />
      {/* Mostrar Bienvenido solo si no hay acción seleccionada */}
      {!action && <h2>Bienvenido, {user.name}</h2>}
      {/* Mostrar el nombre de la sección si hay acción seleccionada */}
      {action && <h2>{sectionNames[action] || ''}</h2>}
      {action === 'fichajes' ? (
        <div className="fichajes-list">
          <h3>Mis Fichajes:</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {fichajes.length === 0 && (
                <tr><td colSpan={3}>No hay fichajes registrados.</td></tr>
              )}
              {fichajes.map(f => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td className={f.tipo === 'entrada' ? 'entrada' : 'salida'}>{f.tipo.toUpperCase()}</td>
                  <td>{new Date(f.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : action === 'crear' ? (
        <CrearEmpleado token={token} onCreated={() => setAction('')} />
      ) : action === 'manual' ? (
        <FichajeManual token={token} user={user} onFichaje={() => setAction('fichajes')} />
      ) : action === 'editar' ? (
        <EditarFichajes token={token} user={user} />
      ) : action === 'eliminar' ? (
        <EliminarFichajes token={token} user={user} />
      ) : action === 'exportar' ? (
        <ExportarDatos token={token} user={user} />
      ) : action === 'imprimir' ? (
        <ImprimirInforme token={token} user={user} />
      ) : action === 'todos' && user.role === 'admin' ? (
        <div className="fichajes-list">
          <h3>Fichajes de Todos los Empleados</h3>
          <TodosFichajes token={token} />
          <div style={{marginTop:'2rem'}}>
            <ExportarDatos token={token} user={user} todos={true} />
            <ImprimirInforme token={token} user={user} todos={true} />
          </div>
        </div>
      ) : (
        <>
          <h3>Usuarios:</h3>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.name} ({u.username}) - {u.role}</li>
            ))}
          </ul>
          {/* Aquí puedes mostrar el contenido según la acción seleccionada */}
          {action && <div style={{marginTop:20}}>Acción seleccionada: <b>{action}</b></div>}
        </>
      )}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 3000);
  };

  if (!token || !user) {
    return <>
      <Login error={error} onLogin={async (username, password) => {
        try {
          const data = await login(username, password);
          setToken(data.access_token);
          setUser(data.user);
          setError(null);
          showToast('¡Bienvenido!', 'success');
        } catch (err) {
          setError('Credenciales incorrectas');
          showToast('Credenciales incorrectas', 'error');
        }
      }} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </>;
  }
  return (
    <>
      <Header />
      <Dashboard token={token} user={user} onChangeUser={() => {
        setUser(null);
        setToken(null);
        showToast('Sesión cerrada', 'info');
      }} showToast={showToast} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </>
  );
}
