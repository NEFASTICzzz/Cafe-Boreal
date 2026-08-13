# Carpeta de Evidencias: Café Boreal S.R.L.

En esta carpeta se almacenan y compilan todas las evidencias ejecutables y visuales requeridas por la rúbrica del examen:

## Estructura de Evidencias

1. `kubectl_status.txt`: Salida de `kubectl get nodes,pods,svc,ingress -n cafe-boreal -o wide` mostrando todos los elementos en estado `Ready` y `Running`.
2. `curl_healthz.txt`: Respuestas de los healthchecks HTTP/HTTPS (`/healthz`, `/api/catalog/healthz`, `/api/customers/healthz`, `/legacy/healthz`).
3. `legacy_inventory_curl.txt`: Consulta de prueba `/legacy/inventory?sku=SKU-TAR-001`.
4. `select_cifrado_evidence.png` / `select_cifrado.txt`: Captura y salida del `SELECT` directo en PostgreSQL mostrando la columna `identity_number_encrypted` almacenando el ciphertext AES-256.
5. `grafana_loki_dashboard.png`: Captura de pantalla del dashboard en Grafana (:5555) visualizando paneles de CPU/Memoria y consultas de logs por etiquetas en Loki.
6. `load_tests_report.txt`: Salida de las pruebas de carga (`load_test.sh`) reportando p95 latencia y tasa de 0% errores.
7. `backup_restore_validation.txt`: Log de la ejecución exitosa de `backup.sh` y `restore.sh`.
