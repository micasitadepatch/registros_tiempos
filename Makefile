.PHONY: install start dev seed backup backup-schedule format help clean

# Variables
NODE = node
NPM = npm

help:
	@echo === Comandos del Sistema de Fichajes ===
	@echo.
	@echo make install          # Instala dependencias
	@echo make start           # Inicia servidor (produccion)
	@echo make dev             # Inicia servidor (desarrollo)
	@echo make seed            # Inicializa base de datos
	@echo make backup          # Backup manual
	@echo make backup-schedule # Backups automaticos
	@echo make format          # Formatea codigo
	@echo make clean           # Limpia archivos temporales
	@echo.

install:
	$(NPM) install

start:
	$(NPM) run start

dev:
	$(NPM) run dev

seed:
	$(NPM) run seed

backup:
	$(NPM) run backup

backup-schedule:
	$(NPM) run backup:schedule

format:
	$(NPM) run format

clean:
	-rd /s /q node_modules 2>nul
	-del /f /q data\backups\sistema\*.tar.gz 2>nul
	$(NPM) cache clean --force
