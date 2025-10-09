// API para guardar y leer datos JSON en la carpeta data
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const router = express.Router();
const DATA_DIR = path.join(__dirname, 'data');

router.use(cors());
router.use(express.json());

// Helper para asegurar la carpeta data
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// GET /api/data/:file - Leer datos
router.get('/data/:file', (req, res) => {
    ensureDataDir();
    const file = req.params.file;
    const filePath = path.join(DATA_DIR, file + '.json');
    if (!fs.existsSync(filePath)) {
        return res.json({});
    }
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err)
            return res.status(500).json({ error: 'Error leyendo archivo' });
        try {
            res.json(JSON.parse(data));
        } catch {
            res.status(500).json({ error: 'JSON inválido' });
        }
    });
});

// POST /api/data/:file - Guardar datos
router.post('/data/:file', (req, res) => {
    ensureDataDir();
    const file = req.params.file;
    const filePath = path.join(DATA_DIR, file + '.json');
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err)
            return res.status(500).json({ error: 'Error guardando archivo' });
        res.json({ ok: true });
    });
});

module.exports = router;
