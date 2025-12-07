import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { FaFileCsv, FaFilePdf, FaFileAlt, FaFileWord } from 'react-icons/fa';
import { API_URL } from './api';

export default function ExportarDatos({ token, user, todos }) {
  const [fichajes, setFichajes] = useState([]);
  const [error, setError] = useState('');
  // CORREGIDO: Usar el logo local para evitar errores de CORS y formato.
  const logoUrl = process.env.PUBLIC_URL + '/logo.png';

  useEffect(() => {
    const url = todos ? `${API_URL}/fichajes` : `${API_URL}/fichajes/by_user/${user.id}`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => res.json())
      .then(setFichajes)
      .catch(() => setFichajes([]));
  }, [token, user, todos]);

  const exportCSV = () => {
    if (fichajes.length === 0) return;
    const header = todos ? 'Empleado,ID,Tipo,Fecha\n' : 'ID,Tipo,Fecha\n';
    const rows = fichajes.map(f =>
      todos ? `${f.user?.name || ''},${f.id},${f.tipo},${new Date(f.timestamp).toLocaleString()}`
            : `${f.id},${f.tipo},${new Date(f.timestamp).toLocaleString()}`
    ).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fichajes_${user.name.replace(/\s/g,'_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (fichajes.length === 0) return;
    const doc = new jsPDF();
    
    // NOTA: Si esto sigue fallando, podría ser por el error "PNG signature".
    // La solución sería comentar la siguiente línea.
    try {
      doc.addImage(logoUrl, 'PNG', 12, 10, 32, 32);
    } catch (e) {
      console.error("Error al añadir el logo al PDF:", e);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(todos ? 'Fichajes de todos los empleados' : `Fichajes de ${user.name}`, 50, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(194, 58, 92);
    doc.setFillColor(248, 230, 238);
    doc.rect(10, 44, 190, 10, 'F');
    if (todos) {
      doc.text('Empleado', 15, 51);
      doc.text('ID', 55, 51);
      doc.text('Tipo', 80, 51);
      doc.text('Fecha', 110, 51);
    } else {
      doc.text('ID', 15, 51);
      doc.text('Tipo', 40, 51);
      doc.text('Fecha', 70, 51);
    }
    let y = 61;
    fichajes.forEach(f => {
      if (todos) {
        doc.text(`${f.user?.name || ''}`, 15, y);
        doc.text(`${f.id}`, 55, y);
        doc.text(`${f.tipo.charAt(0).toUpperCase() + f.tipo.slice(1)}`, 80, y);
        doc.text(`${new Date(f.timestamp).toLocaleString()}`, 110, y);
      } else {
        doc.text(`${f.id}`, 15, y);
        doc.text(`${f.tipo.charAt(0).toUpperCase() + f.tipo.slice(1)}`, 40, y);
        doc.text(`${new Date(f.timestamp).toLocaleString()}`, 70, y);
      }
      y += 8;
      if (y > 270) {
        doc.addPage();
        if (logoUrl) {
          try {
            doc.addImage(logoUrl, 'PNG', 12, 10, 32, 32);
          } catch (e) {
            console.error("Error al añadir el logo en nueva página:", e);
          }
        }
        y = 61;
      }
    });
    doc.save(todos ? 'Fichajes_Todos.pdf' : `Fichajes_${user.name.replace(/\s/g,'_')}.pdf`);
  };

  const exportTXT = () => {
    // ... (resto del código sin cambios)
  };

  const exportWord = () => {
    // ... (resto del código sin cambios)
  };

  return (
    <div style={{maxWidth:400,margin:'2rem auto',padding:'1rem',background:'#f8e6ee',borderRadius:10}}>
      <h3>Exportar Datos</h3>
      <div className="export-options">
        <button onClick={exportCSV} disabled={fichajes.length === 0}><FaFileCsv />CSV</button>
        <button onClick={exportPDF} disabled={fichajes.length === 0}><FaFilePdf />PDF</button>
        <button onClick={exportTXT} disabled={fichajes.length === 0}><FaFileAlt />TXT</button>
        <button onClick={exportWord} disabled={fichajes.length === 0}><FaFileWord />Word</button>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      {fichajes.length === 0 && <div style={{marginTop:10}}>No hay fichajes para exportar.</div>}
    </div>
  );
}
