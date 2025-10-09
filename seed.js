require('dotenv').config();
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'fichajes.db');
const db = new sqlite3.Database(dbPath);
const saltRounds = 10;

const usersToSeed = [];

// Cargar usuario administrador principal desde .env
if (process.env.INITIAL_ADMIN_USER && process.env.INITIAL_ADMIN_PASSWORD) {
    usersToSeed.push({
        username: process.env.INITIAL_ADMIN_USER,
        name: 'Administrador',
        password: process.env.INITIAL_ADMIN_PASSWORD,
        role: 'admin',
    });
}

// Cargar usuario 1 desde .env
if (process.env.USER_1_USERNAME && process.env.USER_1_PASSWORD) {
    usersToSeed.push({
        username: process.env.USER_1_USERNAME,
        name: process.env.USER_1_NAME || process.env.USER_1_USERNAME,
        password: process.env.USER_1_PASSWORD,
        role: process.env.USER_1_ROLE || 'employee',
    });
}

// Cargar usuario 2 desde .env
if (process.env.USER_2_USERNAME && process.env.USER_2_PASSWORD) {
    usersToSeed.push({
        username: process.env.USER_2_USERNAME,
        name: process.env.USER_2_NAME || process.env.USER_2_USERNAME,
        password: process.env.USER_2_PASSWORD,
        role: process.env.USER_2_ROLE || 'employee',
    });
}

async function seed() {
    if (usersToSeed.length === 0) {
        console.log(
            'No hay usuarios para sembrar. Asegúrate de configurar las variables de entorno en el archivo .env'
        );
        db.close();
        return;
    }

    console.log('Iniciando la siembra de la base de datos...');

    const run = (sql, params) =>
        new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        console.log(`El usuario '${params[0]}' ya existe.`);
                        resolve(); // No es un error fatal, continuamos.
                    } else {
                        reject(err);
                    }
                } else {
                    console.log(
                        `Usuario '${params[0]}' creado con ID: ${this.lastID}`
                    );
                    resolve();
                }
            });
        });

    const sql = `INSERT INTO users (username, name, password_hash, role) VALUES (?, ?, ?, ?)`;

    for (const user of usersToSeed) {
        try {
            const hash = await bcrypt.hash(user.password, saltRounds);
            await run(sql, [user.username, user.name, hash, user.role]);
        } catch (error) {
            console.error(
                `Error procesando al usuario ${user.username}:`,
                error.message
            );
        }
    }

    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos', err.message);
        } else {
            console.log('Base de datos cerrada correctamente.');
        }
    });

    console.log('Siembra de datos completada.');
}

seed();
