import React, { useEffect, useState } from 'react';
import './Header.css';

export default function Header() {
  const [hora, setHora] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="header" style={{ textAlign: 'center', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img
        src="https://www.micasitadepatch.com/image/data/logo-micasitadepatch.png"
        alt="Logo Mi Casita de Patch"
        style={{ height: 130, marginBottom: 14, display: 'block' }}
      />
      <h1 style={{ margin: '0.5em 0', fontSize: '1.8rem', width: '100%', maxWidth: 600, textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px', lineHeight: '1.2' }}>
        Registros tiempos empleados<br />Mi Casita de Patch
      </h1>
      <div
        style={{
          fontSize: '2.2rem',
          color: '#2e8b57',
          fontWeight: 'bold',
          marginTop: '0.5em',
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        {hora.toLocaleTimeString()}
      </div>
    </header>
  );
}
