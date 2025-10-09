const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'fichajes.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(
            'Error al conectar con la base de datos SQLite',
            err.message
        );
    } else {
        console.log('Conectado a la base de datos SQLite.');
        db.exec('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error(
                    'No se pudo activar la restricción de clave externa (foreign key): ',
                    err
                );
            }
        });
    }
});

const initDb = () => {
    const usersSchema = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'employee'))
        );
    `;

    const fichajesSchema = `
        CREATE TABLE IF NOT EXISTS fichajes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            timestamp DATETIME NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('entrada', 'salida')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
    `;

    db.serialize(() => {
        db.run(usersSchema, (err) => {
            if (err) {
                console.error("Error creando la tabla 'users'", err.message);
            }
        });
        db.run(fichajesSchema, (err) => {
            if (err) {
                console.error("Error creando la tabla 'fichajes'", err.message);
            }
        });
    });
};

module.exports = { db, initDb };
