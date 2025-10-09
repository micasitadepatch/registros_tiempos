// Cargar variables de entorno al inicio de la aplicación
require('dotenv').config();

// Backend Node.js para el sistema de fichajes
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const app = express();
const upload = multer();

// Inicializar la base de datos
const { initDb } = require('./database');
initDb();

// Importar rutas de la API
const authApiRouter = require('./auth-api');
const fichajesApiRouter = require('./fichajes-api');

app.use(cors());
app.use(express.json());

// Usar las rutas de la API
app.use('/api', authApiRouter);
app.use('/api', fichajesApiRouter);

// La ruta /api/send-email se mantiene
app.post('/api/send-email', upload.single('file'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!email || !file) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Configura el transporte SMTP usando variables de entorno
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: parseInt(process.env.SMTP_PORT) === 465, // true para 465, false para otros
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `Mi Casita de Patch <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Fichajes exportados',
            text: 'Adjunto tienes el archivo exportado.',
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ],
        });
        res.json({ ok: true });
    } catch (err) {
        console.error('Error al enviar el email:', err);
        res.status(500).json({
            error: 'Error enviando email',
            details: err.message,
        });
    }
});

// Usar el puerto de las variables de entorno, con un fallback
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
