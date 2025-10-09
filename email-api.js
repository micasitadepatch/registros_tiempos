const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

const router = express.Router();
const upload = multer(); // Usamos multer para procesar el `form-data` del archivo

// POST /api/send-email
router.post('/send-email', upload.single('file'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!email || !file) {
        return res
            .status(400)
            .json({
                error: 'Faltan el email del destinatario o el archivo adjunto.',
            });
    }

    // Validar que las variables de entorno para el email están configuradas
    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS
    ) {
        console.error(
            'La configuración de SMTP no está completa en el archivo .env'
        );
        return res
            .status(500)
            .json({ error: 'El servidor de correo no está configurado.' });
    }

    // Configurar el transporte SMTP usando variables de entorno
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: parseInt(process.env.SMTP_PORT) === 465, // true para el puerto 465, false para otros
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `Sistema de Fichajes <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Informe de Fichajes Exportado',
            text: 'Adjunto encontrarás el archivo con el informe de fichajes solicitado.',
            attachments: [
                {
                    filename: file.originalname,
                    content: file.buffer,
                },
            ],
        });
        res.status(200).json({ message: 'Email enviado correctamente.' });
    } catch (err) {
        console.error('Error al enviar el email:', err);
        res.status(500).json({
            error: 'Hubo un error al intentar enviar el email.',
            details: err.message,
        });
    }
});

module.exports = router;
