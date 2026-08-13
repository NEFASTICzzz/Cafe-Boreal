#!/bin/bash
# ==============================================================================
# Smoke Tests Reproducibles para Cafe Boreal S.R.L.
# ==============================================================================

BASE_URL="${BASE_URL:-https://localhost}"
CURL_OPTS="-k -s" # Ignorar validación de certificado autofirmado para pruebas locales

echo "🧪 Iniciando Smoke Tests en $BASE_URL..."
FAILURES=0

check_endpoint() {
    local name="$1"
    local path="$2"
    local expected_str="$3"

    echo -n "  • Evaluando $name ($path)... "
    response=$(curl $CURL_OPTS "$BASE_URL$path")

    if echo "$response" | grep -q "$expected_str"; then
        echo "✅ OK"
    else
        echo "❌ FAIL (Respuesta no contenía '$expected_str')"
        echo "    Salida recibida: ${response:0:150}..."
        FAILURES=$((FAILURES + 1))
    fi
}

check_endpoint "Catalog Healthz" "/api/catalog/healthz" '"status":"ok"'
check_endpoint "Orders Healthz" "/api/orders/healthz" '"status":"ok"'
check_endpoint "Customers Healthz" "/api/customers/healthz" '"status":"ok"'
check_endpoint "Legacy Healthz" "/legacy/healthz" '"status":"ok"'
check_endpoint "Catalog API List" "/api/catalog" 'Café'
check_endpoint "Customers API List (Unencrypted View)" "/api/customers" 'identity_number'
check_endpoint "Customers Raw DB (Encrypted SELECT Evidence)" "/api/customers/debug/raw-db" 'identity_number_encrypted'
check_endpoint "Legacy Inventory SKU Search" "/legacy/inventory?sku=SKU-TAR-001" 'SKU-TAR-001'

echo "--------------------------------------------------------"
if [ $FAILURES -eq 0 ]; then
    echo "🎉 TODOS LOS SMOKE TESTS PASARON EXITOSAMENTE (0 Fallos)"
    exit 0
else
    echo "⚠️ ATENCION: Hubo $FAILURES fallos en las pruebas de humo."
    exit 1
fi
