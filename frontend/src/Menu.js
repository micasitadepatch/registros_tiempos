import React from 'react';
import { FaList, FaUserPlus, FaClock, FaEdit, FaTrash, FaFileExport, FaPrint, FaUsers } from 'react-icons/fa';
import './Menu.css';

export default function Menu({ onAction, role }) {
  return (
    <nav className="main-menu">
      <button onClick={() => onAction('fichajes')}><FaList style={{marginRight:6}}/>Ver Mis Fichajes</button>
      {(role === 'admin') && <button onClick={() => onAction('crear')}><FaUserPlus style={{marginRight:6}}/>Crear Empleado</button>}
      <button onClick={() => onAction('manual')}><FaClock style={{marginRight:6}}/>Fichaje Manual</button>
      {(role === 'admin') && <button onClick={() => onAction('editar')}><FaEdit style={{marginRight:6}}/>Editar Fichajes</button>}
      {(role === 'admin') && <button onClick={() => onAction('eliminar')}><FaTrash style={{marginRight:6}}/>Eliminar Fichajes</button>}
      {(role === 'admin') && <button onClick={() => onAction('todos')}><FaUsers style={{marginRight:6}}/>Ver Fichajes de Todos</button>}
      <button onClick={() => onAction('exportar')} className="export-btn"><FaFileExport style={{marginRight:6}}/>Exportar Datos</button>
      <button onClick={() => onAction('imprimir')} className="print-btn"><FaPrint style={{marginRight:6}}/>Imprimir Informe</button>
    </nav>
  );
}
