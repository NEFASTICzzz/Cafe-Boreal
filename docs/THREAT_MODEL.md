# Modelo de Amenazas (STRIDE) & Guía de Hardening: Café Boreal S.R.L.

---

## 1. Análisis de Amenazas STRIDE

| Categoría STRIDE | Amenaza Identificada | Mitigación Implementada |
|---|---|---|
| **Spoofing (Suplantación)** | Suplantación de la API o del servidor Nginx por interceptación de tráfico. | **HTTPS Obligatorio** con Nginx frontal, TLS 1.2/1.3, redirección HTTP->HTTPS y certificados firmados. |
| **Tampering (Manipulación)** | Modificación de registros de clientes o alteración de precios de productos en tránsito. | Integridad de datos en PostgreSQL + validación de esquemas en APIs Node.js y headers HTTPS. |
| **Repudiation (Repudio)** | Negación de creación de pedidos o cambios de inventario. | Logging centralizado en **Loki** con trazabilidad por contenedor, pod y marca de tiempo. |
| **Information Disclosure (Fuga)** | Exposición del número de cédula/identidad de clientes en robos de base de datos o backups. | **Cifrado AES-256-CBC** a nivel de almacenamiento con clave de 256 bits resguardada en K8s Secret. |
| **Denial of Service (DoS)** | Saturación de peticiones tumbando las APIs de pedidos o catálogo. | **Resource Limits & Requests** en pods K8s (CPU/Memoria), compresión Nginx y healthcheck probes. |
| **Elevation of Privilege (Elevación)** | Compromiso de un contenedor obteniendo acceso root al host de la VM. | **Containers No-Root** (`runAsNonRoot: true`, `runAsUser: 1000`) en la especificación K8s. |

---

## 2. Pautas de Hardening de la VM y del Sistema Operativo

### A. Configuración de Firewall UFW (Puertos Mínimos)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH para administración
sudo ufw allow 80/tcp    # HTTP (Redirección obligatoria a HTTPS)
sudo ufw allow 443/tcp   # HTTPS (Front-End & APIs)
sudo ufw allow 5555/tcp  # Grafana Dashboard (Restringido a red interna si se desea)
sudo ufw enable
```

### B. Procedimiento de Rotación de Secretos (Clave AES-256)
1. Generar nueva clave de 256 bits:
   `openssl rand -hex 16`
2. Actualizar el Secret de Kubernetes:
   `kubectl create secret generic customers-secret --from-literal=ENCRYPTION_KEY="NUEVA_CLAVE_256_BITS" -n cafe-boreal --dry-run=client -o yaml | kubectl apply -f -`
3. Reiniciar el Deployment de `customers-api` para cargar el nuevo secreto:
   `kubectl rollout restart deployment/customers-api -n cafe-boreal`
