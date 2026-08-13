# Política de Clasificación de Datos & Matriz de Controles: Café Boreal S.R.L.

---

## 1. Niveles de Clasificación de Datos

Café Boreal S.R.L. establece 3 niveles estrictos de clasificación de la información:

```
+-------------------------------------------------------------------+
| NIVEL 1: PÚBLICO                                                  |
| Catálogo de productos, precios, nombres públicos, descripciones. |
+-------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------+
| NIVEL 2: INTERNO / OPERATIVO                                      |
| Existencias de inventario en bodega (módulo legado), estados de   |
| pedidos, logs del sistema, métricas de CPU/Memoria.              |
+-------------------------------------------------------------------+
                                 |
                                 v
+-------------------------------------------------------------------+
| NIVEL 3: CONFIDENCIAL / RESTRINGIDO (PII)                         |
| Números de identidad/cédulas de clientes, llaves privadas de     |
| cifrado, tokens de sesión, backups completos de la BD.           |
+-------------------------------------------------------------------+
```

---

## 2. Matriz de Controles de Seguridad

| Tipo de Dato | Nivel | Control de Almacenamiento | Control de Tránsito | Control de Acceso |
|---|---|---|---|---|
| Catálogo de Productos | Nivel 1 (Público) | Base de Datos PostgreSQL | HTTPS / TLS 1.2+ | Lectura pública via API |
| Inventario Legado | Nivel 2 (Interno) | SQLite / MariaDB Legada | HTTPS / TLS 1.2+ | Redirección `/legacy/*` en Nginx |
| N° Cédula / Identidad | Nivel 3 (Confidencial) | **Cifrado obligatorio AES-256-CBC** | HTTPS / TLS 1.2+ obligatorio | Solo API/UI autenticada desencripta |
| Clave de Cifrado (256-bits)| Nivel 3 (Confidencial) | **Kubernetes Secret (`customers-secret`)**| Inyección en memoria de Pod | Exclusivo `customers-api` container |
| Archivos de Backup | Nivel 3 (Confidencial) | Compresión Gzip en directorio restringido | SSH / SCP seguro | Administrador de Infraestructura |

---

## 3. Demostración de Cifrado de Identidad (Cédulas)

El número de identidad de los clientes **NUNCA** se guarda en texto plano en la base de datos. Se procesa mediante la clave de 256 bits almacenada en el Secret de K8s (`ENCRYPTION_KEY`).

- **Comando SELECT Directo en Base de Datos (Modo Raw)**:
  `SELECT id, name, email, identity_number_encrypted FROM customers;`
  - *Resultado*: `3a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d:8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a` (Ciphertext base64/hex + IV).
- **Consulta via API REST (`GET /api/customers`)**:
  - *Resultado*: `{"id": 1, "name": "María Rodríguez", "identity_number": "101110222"}` (Desencriptado dinámicamente en memoria).
