@echo off
if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="install" goto install
if "%1"=="start" goto start
if "%1"=="dev" goto dev
if "%1"=="seed" goto seed
if "%1"=="backup" goto backup
if "%1"=="backup-schedule" goto backup-schedule
if "%1"=="format" goto format
if "%1"=="clean" goto clean
goto help

:help
echo.
echo === Comandos del Sistema de Fichajes ===
echo.
echo cmd.bat install          # Instala dependencias
echo cmd.bat start           # Inicia servidor (produccion)
echo cmd.bat dev             # Inicia servidor (desarrollo)
echo cmd.bat seed            # Inicializa base de datos
echo cmd.bat backup          # Backup manual
echo cmd.bat backup-schedule # Backups automaticos
echo cmd.bat format          # Formatea codigo
echo cmd.bat clean           # Limpia archivos temporales
echo.
goto :eof

:install
npm install
goto :eof

:start
npm run start
goto :eof

:dev
npm run dev
goto :eof

:seed
npm run seed
goto :eof

:backup
npm run backup
goto :eof

:backup-schedule
npm run backup:schedule
goto :eof

:format
npm run format
goto :eof

:clean
rd /s /q node_modules 2>nul
del /f /q data\backups\sistema\*.tar.gz 2>nul
npm cache clean --force
goto :eof
