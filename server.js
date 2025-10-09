require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');

// Importar los módulos de la API
const authApiRouter = require('./auth-api');
const fichajesApiRouter = require('./fichajes-api');
const emailApiRouter = require('./email-api'); // Importamos el nuevo módulo

// Inicializar la base de datos
initDb();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Montar las rutas de la API
app.use('/api', authApiRouter);
app.use('/api', fichajesApiRouter);
app.use('/api', emailApiRouter); // Usamos el nuevo módulo

// Usar el puerto de las variables de entorno, con un fallback
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
