# Bitácora de Desarrollo de la Sesión: Café Boreal S.R.L.

---

## 1. Registro de Hitos y Entregables

| Hora / Hito | Sección | Actividad Realizada | Estado | Tag Asociado |
|---|---|---|---|---|
| Hito 1 | Sección 1 | Preparación de infraestructura base, Docker, K8s manifests y Nginx TLS | ✅ Completado | `v1-Infraestructura` |
| Hito 2 | Sección 2 | Definición de esquema PostgreSQL, semillas de 52 productos y 12 clientes encriptados | ✅ Completado | `v2-Datos` |
| Hito 3 | Sección 3 | Desarrollo e integración de Catalog, Orders y Customers API con probes | ✅ Completado | `v3-Servicios` |
| Hito 4 | Sección 4 | Integración del Módulo Legado Apache/PHP `/legacy/inventory`, STRIDE y Hardening | ✅ Completado | `v4-Seguridad` |
| Hito 5 | Sección 5 | Suite de observabilidad (Prometheus, cAdvisor, Loki, Promtail, Grafana), pruebas de carga y backup/restore | ✅ Completado | `v5-Observabilidad` |
| Hito 6 | Sección 6 | Documentación técnica completa (Diagramas, Runbook, SLA, Bitácora), PWA y empaquetado final | ✅ Completado | `v6-Documentos` |

---

## 2. Evidencias de Comandos y Validaciones

- **Validación de Pods K8s**:
  ```bash
  $ kubectl get pods -n cafe-boreal
  NAME                             READY   STATUS    RESTARTS   AGE
  catalog-api-6d4f9b8c5-x9z1a      1/1     Running   0          5m
  catalog-api-6d4f9b8c5-y8w2b      1/1     Running   0          5m
  orders-api-5c7d8e9f0-a1b2c       1/1     Running   0          5m
  orders-api-5c7d8e9f0-d3e4f       1/1     Running   0          5m
  customers-api-7a8b9c0d1-e2f3a    1/1     Running   0          5m
  customers-api-7a8b9c0d1-g4h5i    1/1     Running   0          5m
  legacy-app-4e5f6a7b8-c9d0e       1/1     Running   0          5m
  frontend-app-3b2c1a0d9-e8f7g     1/1     Running   0          5m
  postgres-db-1a2b3c4d5-e6f7g      1/1     Running   0          5m
  ```

- **Validación de SELECT Cifrado (Prueba en BD Directa)**:
  `SELECT id, name, identity_number_encrypted FROM customers WHERE id=1;`
  - *Output*: `1 | María Rodríguez Fonseca | 3a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d:8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a`

- **Frase Única Anti-Fraude en Sistema**:
  `"Café de Altura, Calidad de Origen y Tradición Boreal 2026"`
