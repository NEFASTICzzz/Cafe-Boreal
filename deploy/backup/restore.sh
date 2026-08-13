#!/bin/bash
# Script de Restauracion (Restore) Reproducible para Cafe Boreal SRL

if [ -z "$1" ]; then
    echo "Uso: $0 <path_al_archivo_sql_o_gz>"
    echo "Ejemplo: $0 ./dumps/boreal_db_backup_20260813_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Archivo de respaldo no encontrado: $BACKUP_FILE"
    exit 1
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-boreal_user}"
DB_NAME="${DB_NAME:-boreal_db}"
PGPASSWORD="${DB_PASSWORD:-boreal_pass_256bit_secure}"
export PGPASSWORD

echo "🔄 Restaurando base de datos $DB_NAME desde $BACKUP_FILE..."

if [[ "$BACKUP_FILE" == *.gz ]]; then
    zcat "$BACKUP_FILE" | docker exec -i boreal-postgres psql -U "$DB_USER" -d "$DB_NAME"
else
    cat "$BACKUP_FILE" | docker exec -i boreal-postgres psql -U "$DB_USER" -d "$DB_NAME"
fi

echo "✅ Restauracion completada satisfactoriamente."
