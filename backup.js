const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function createBackup() {
    const date = new Date();
    const timestamp = date
        .toISOString()
        .replace(/[:.]/g, '')
        .replace('T', '_')
        .split('Z')[0];

    const backupDir = path.join(__dirname, 'data', 'backups', 'sistema');
    const dbPath = path.join(__dirname, 'fichajes.db');
    const backupFileName = `sistema_fichajes_backup_${timestamp}`;
    const backupPath = path.join(backupDir, backupFileName);

    try {
        // Asegurar que el directorio de backup existe
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Copiar la base de datos
        fs.copyFileSync(dbPath, backupPath + '.db');

        // Comprimir el archivo
        await execAsync(
            `tar -czf "${backupPath}.tar.gz" -C "${path.dirname(backupPath)}" "${path.basename(backupPath)}.db"`
        );

        // Eliminar el archivo .db temporal
        fs.unlinkSync(backupPath + '.db');

        // Mantener solo los últimos 5 backups
        const files = fs
            .readdirSync(backupDir)
            .filter((file) => file.endsWith('.tar.gz'))
            .sort()
            .reverse();

        if (files.length > 5) {
            files.slice(5).forEach((file) => {
                fs.unlinkSync(path.join(backupDir, file));
            });
        }

        console.log(`Backup creado exitosamente: ${backupFileName}.tar.gz`);
    } catch (error) {
        console.error('Error al crear el backup:', error);
        throw error;
    }
}

// Si el script se ejecuta directamente
if (require.main === module) {
    createBackup().catch(console.error);
}

module.exports = createBackup;
