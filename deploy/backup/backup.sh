#!/bin/bash
# Script de Backup Reproducible para Cafe Boreal SRL (PostgreSQL)

BACKUP_DIR="$(dirname "$0")/dumps"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/boreal_db_backup_$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-boreal_user}"
DB_NAME="${DB_NAME:-boreal_db}"
PGPASSWORD="${DB_PASSWORD:-boreal_pass_256bit_secure}"

export PGPASSWORD

echo "📦 Iniciando Backup de Base de Datos ($DB_NAME)..."

if command -v pg_dump &> /dev/null; then
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" | gzip > "$FILENAME"
else
    echo "⚙️ Usando ejecucion via Docker/Container pg_dump..."
    docker exec -e PGPASSWORD="$PGPASSWORD" boreal-postgres pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$FILENAME"
fi

if [ -f "$FILENAME" ]; then
    echo "✅ Backup completado exitosamente: $FILENAME"
    echo "📊 Tamanio del archivo: $(du -h "$FILENAME" | cut -f1)"
else
    echo "❌ Error generando el respaldo."
    exit 1
fi
