import React, { useState, useEffect, useRef } from 'react';
import { FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { API_URL } from './api'; // <-- CORREGIDO

export default function ImprimirInforme({ token, user, todos }) {
  const [fichajes, setFichajes] = useState([]);
  const [error, setError] = useState('');
  const printRef = useRef();
  // Usa logo local en public/logo.png para evitar errores de PNG
  const logoUrl = process.env.PUBLIC_URL + '/logo.png';

  useEffect(() => {
    if (todos) {
      fetch(`${API_URL}/fichajes`, { // <-- CORREGIDO
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors'
      })
        .then(res => res.json())
        .then(setFichajes)
        .catch(() => setFichajes([]));
    } else {
      fetch(`${API_URL}/fichajes/by_user/${user.id}`, { // <-- CORREGIDO
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        mode: 'cors'
      })
        .then(res => res.json())
        .then(setFichajes)
        .catch(() => setFichajes([]));
    }
  }, [token, user, todos]);

  const handlePrint = () => {
    if (printRef.current) {
      // Mostrar el contenido temporalmente
      printRef.current.style.display = 'block';
      setTimeout(() => {
        const printContents = printRef.current.innerHTML;
        const win = window.open('', '', 'width=800,height=600');
        win.document.write('<html><head><title>Informe de Fichajes</title>');
        win.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #c23a5c;padding:6px;} th{background:#f8e6ee;color:#c23a5c;} img{float:left;}</style>');
        win.document.write('</head><body>');
        win.document.write(printContents);
        win.document.write('</body></html>');
        win.document.close();
        win.onload = () => {
          win.print();
          win.close();
        };
        // Ocultar el contenido después de imprimir
        printRef.current.style.display = 'none';
      }, 100);
    }
  };

  // Exportar PDF con formato visual mejorado y sin logo
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'A4' });
    let y = 40;
    doc.setFontSize(18);
    doc.setTextColor('#c23a5c');
    doc.text(todos ? 'Informe de Fichajes de Todos los Empleados' : `Informe de Fichajes de ${user.name}`, 40, y);
    y += 30;
    doc.setFontSize(12);
    doc.setTextColor('#333');
    let headers = todos ? ['Empleado', 'ID', 'Tipo', 'Fecha'] : ['ID', 'Tipo', 'Fecha'];
    let data = fichajes.map(f => todos ? [f.user?.name || '', f.id, f.tipo, new Date(f.timestamp).toLocaleString()] : [f.id, f.tipo, new Date(f.timestamp).toLocaleString()]);
    // Encabezados
    headers.forEach((h, i) => {
      doc.setFont(undefined, 'bold');
      doc.text(h, 40 + i * 120, y);
    });
    y += 20;
    // Filas
    data.forEach((row, idx) => {
      row.forEach((cell, i) => {
        doc.setFont(undefined, 'normal');
        doc.text(String(cell), 40 + i * 120, y + idx * 18);
      });
    });
    doc.save('fichajes.pdf');
  };

  // Exportar CSV
  const exportCSV = () => {
    let headers = todos ? ['Empleado', 'ID', 'Tipo', 'Fecha'] : ['ID', 'Tipo', 'Fecha'];
    let data = fichajes.map(f => todos ? [f.user?.name || '', f.id, f.tipo, new Date(f.timestamp).toLocaleString()] : [f.id, f.tipo, new Date(f.timestamp).toLocaleString()]);
    let csvContent = '';
    csvContent += headers.join(',') + '\n';
    data.forEach(row => {
      csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'fichajes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{maxWidth:500,margin:'2rem auto',padding:'1rem',background:'#f8e6ee',borderRadius:10}}>
      <h3>Imprimir Informe</h3>
      <div className="export-options">
        <button onClick={handlePrint} disabled={fichajes.length === 0}><FaPrint />Imprimir</button>
        <button onClick={exportPDF} disabled={fichajes.length === 0}>Descargar PDF</button>
        <button onClick={exportCSV} disabled={fichajes.length === 0}>Descargar CSV</button>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div ref={printRef} style={{display:'none'}}>
        {/* Elimina el logo para evitar el error de PNG signature en jsPDF */}
        {/* <div style={{textAlign:'center',marginBottom:'1rem'}}>
          <img src={logoUrl} alt="Logo" style={{height:60,marginBottom:10}} />
        </div> */}
        <h2>{todos ? 'Informe de Fichajes de Todos los Empleados' : `Informe de Fichajes de ${user.name}`}</h2>
        <table>
          <thead>
            <tr>{todos ? (<><th>Empleado</th><th>ID</th><th>Tipo</th><th>Fecha</th></>) : (<><th>ID</th><th>Tipo</th><th>Fecha</th></>)}</tr>
          </thead>
          <tbody>
            {fichajes.map(f => (
              todos ? (
                <tr key={f.id}>
                  <td>{f.user?.name || ''}</td>
                  <td>{f.id}</td>
                  <td>{f.tipo}</td>
                  <td>{new Date(f.timestamp).toLocaleString()}</td>
                </tr>
              ) : (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td>{f.tipo}</td>
                  <td>{new Date(f.timestamp).toLocaleString()}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
      {fichajes.length === 0 && <div style={{marginTop:10}}>No hay fichajes para imprimir.</div>}
    </div>
  );
}
