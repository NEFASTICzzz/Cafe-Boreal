# CHANGELOG - Café Boreal S.R.L. (UTN ITI-522)

Todas las modificaciones del proyecto y versiones tagging por sección se documentan en este archivo.

---

## [v6-Documentos] - 2026-08-13
### Alcance: Sección 6 — Documentación y Entrega
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Creación de diagramas lógico y de despliegue en `docs/ARCHITECTURE.md`.
  - Elaboración del `docs/RUNBOOK.md` de operación, arranque, healthchecks y backups.
  - Documentación de SLAs, SLOs, Error Budget y comparativa de infraestructura en `docs/SLA_AND_COMPARATIVE.md`.
  - Compilación de la bitácora de la sesión en `docs/BITACORA.md`.
  - Configuración del script final de Git y empacado de entrega.

---

## [v5-Observabilidad] - 2026-08-13
### Alcance: Sección 5 — Observabilidad y Calidad
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Despliegue de Prometheus server y cAdvisor para recolección de métricas de pods/contenedores.
  - Configuración de Grafana Loki + Promtail para ingesta de logs.
  - Creación del Dashboard de Grafana (`deploy/observability/grafana-dashboard.json`) en puerto 5555.
  - Implementación de pruebas de carga de 2 perfiles (`deploy/scripts/load_test.sh`).
  - Verificación de scripts reproducibles de backup y restore.

---

## [v4-Seguridad] - 2026-08-13
### Alcance: Sección 4 — Integración y Seguridad
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Integración del módulo legado `/legacy/inventory` en Apache + PHP.
  - Configuración del Reverse Proxy Nginx con ruteo `/api/*` y `/legacy/*`.
  - Implementación de cifrado AES-256-CBC de números de identidad en `customers-api`.
  - Generación de evidencias de `SELECT` cifrado directo en base de datos.
  - Documentación de Threat Model STRIDE, clasificación de datos y hardening UFW (`docs/THREAT_MODEL.md` y `docs/DATA_POLICY.md`).

---

## [v3-Servicios] - 2026-08-13
### Alcance: Sección 3 — Servicios
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Desarrollo del microservicio Catalog API (CRUD productos) con liveness/readiness probes.
  - Desarrollo del microservicio Orders API (creación de pedidos y cálculo automático de totales).
  - Desarrollo del microservicio Customers API.
  - Definición de contenedores no-root y especificación de requests/limits en manifiestos Kubernetes.
  - Ejecución de smoke tests en endpoints `/healthz`.

---

## [v2-Datos] - 2026-08-13
### Alcance: Sección 2 — Datos
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Definición del esquema PostgreSQL y migraciones iniciales.
  - Creación de semillas reproducibles (`seed.js` / `seed.sql`) con 52 productos y 12 clientes.
  - Creación de Kubernetes Secret `customers-secret` para resguardar la clave de cifrado de 256 bits.
  - Creación de scripts iniciales de respaldos y restauración.

---

## [v1-Infraestructura] - 2026-08-13
### Alcance: Sección 1 — Infraestructura Base
- **Responsables**: Estudiante 1 & Estudiante 2
- **Cambios**:
  - Preparación del entorno de VM (Ubuntu Server 22.04 LTS).
  - Configuración de Docker, Docker Compose y Kubernetes local (minikube/k3s).
  - Despliegue de base de datos PostgreSQL en contenedor.
  - Configuración inicial de Nginx con TLS autofirmado y redirección obligatoria HTTP->HTTPS.
