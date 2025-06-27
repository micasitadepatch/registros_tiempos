// Backend Node.js para enviar emails con adjunto
const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post('/api/send-email', upload.single('file'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!email || !file) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Configura tu transporte SMTP (rellena estos datos cuando los tengas)
    const transporter = nodemailer.createTransport({
        host: 'smtp.tu-servidor.com', // Cambia esto por tu servidor SMTP
        port: 465, // O 587 según tu proveedor
        secure: true, // true para 465, false para 587
        auth: {
            user: 'TU_EMAIL', // Cambia esto
            pass: 'TU_PASSWORD' // Cambia esto
        }
    });

    try {
        await transporter.sendMail({
            from: 'Mi Casita de Patch <TU_EMAIL>', // Cambia esto
            to: email,
            subject: 'Fichajes exportados',
            text: 'Adjunto tienes el archivo exportado.',
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer
                }
            ]
        });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: 'Error enviando email', details: err.message });
    }
});

app.listen(3001, () => console.log('Servidor de email en puerto 3001')); 