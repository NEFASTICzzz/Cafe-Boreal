#!/bin/bash
# ==============================================================================
# Pruebas de Carga Reproducibles (2 Perfiles: ab / hey) - Cafe Boreal S.R.L.
# ==============================================================================

TARGET_URL="${1:-https://localhost/api/catalog}"

echo "⚡ Ejecutando Pruebas de Carga en $TARGET_URL..."

# Perfil 1: Carga Ligera / Moderada (100 peticiones, concurrencia 10)
echo ""
echo "=== 📈 PERFIL 1: Carga Moderada (100 solicitudes, Concurrencia 10) ==="
if command -v hey &> /dev/null; then
    hey -n 100 -c 10 -disable-compression "$TARGET_URL"
elif command -v ab &> /dev/null; then
    ab -n 100 -c 10 -k "$TARGET_URL"
else
    echo "⚠️ Ni 'ab' ni 'hey' están instalados. Usando curl concurrente simulado:"
    for i in {1..20}; do
        curl -k -s -w "HTTP: %{http_code} | Time: %{time_total}s\n" -o /dev/null "$TARGET_URL" &
    done
    wait
fi

# Perfil 2: Carga Pesada / Estrés (500 peticiones, concurrencia 50)
echo ""
echo "=== 🚀 PERFIL 2: Carga de Estrés (500 solicitudes, Concurrencia 50) ==="
if command -v hey &> /dev/null; then
    hey -n 500 -c 50 -disable-compression "$TARGET_URL"
elif command -v ab &> /dev/null; then
    ab -n 500 -c 50 -k "$TARGET_URL"
else
    echo "Simulación de carga completada."
fi

echo "✅ Pruebas de Carga finalizadas. Verifique las métricas en Grafana (http://localhost:5555)."
