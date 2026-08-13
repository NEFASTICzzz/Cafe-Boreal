# Universidad Técnica Nacional (UTN)
## Práctica de Examen Integrador de ITI-522 para Computación en la Nube
### Caso Empresarial: Café Boreal S.R.L.

---

### Datos de la Entrega

- **Modalidad**: Parejas (Entregable: VM única "enchufar y correr")
- **Fecha Completa**: 13 de Agosto de 2026
- **Nombre Completo Profesor**: ____________________________________________________
- **Nombre Completo Estudiante 1**: ________________________________________________
- **Nombre Completo Estudiante 2**: ________________________________________________
- **URL a Repositorio Público (GitHub/GitLab/BitBucket)**: `https://github.com/tu-usuario/praEXAM`
- **Ramas requeridas**: `main` (estable) / `exam` (trabajo de la sesión)
- **Tags por sección**: `v1-Infraestructura`, `v2-Datos`, `v3-Servicios`, `v4-Seguridad`, `v5-Observabilidad`, `v6-Documentos`
- **Frase única Anti-Fraude**: `"café frío, LO cálido, ¡no puedo perderlo!"`

---

## ☕ Resumen Ejecutivo del Proyecto

Este repositorio contiene la solución técnica integral y reproducible para la plataforma cloud-native e integradora de **Café Boreal S.R.L.** El sistema opera localmente dentro de una VM única (Ubuntu Server 22.04 LTS / Debian 12 o Windows Server) mediante orquestación en **Kubernetes / Docker Compose**.

### Componentes Clave:
1. **Front-End PWA Responsive**: Panel Admin mobile-first en HTML5/CSS3/JS para gestión de catálogo, pedidos, clientes y consulta al sistema legado.
2. **Microservicios (Kubernetes Ready)**:
   - `catalog-api` (Port 3001): CRUD de productos de café.
   - `orders-api` (Port 3002): Gestión de pedidos y cálculo de impuestos (13% IVA CR).
   - `customers-api` (Port 3003): CRUD de clientes con **cifrado AES-256-CBC** de números de cédula/identidad resguardado con Secret de K8s.
3. **Módulo Legado (XAMPP/LAMPP)**: Endpoint `/legacy/inventory` corriendo en Apache + PHP.
4. **Reverse Proxy Nginx Frontal**:
   - TLS/HTTPS obligatorio con certificado autofirmado.
   - Redirección automática HTTP (80) -> HTTPS (443).
   - Ruteo unificado: `https://localhost/api/*` para K8s y `https://localhost/legacy/*` para Apache.
5. **Suite de Observabilidad Completa**: Prometheus + cAdvisor + Grafana (Puerto 5555) + Loki + Promtail.
6. **Reproducibilidad y Respaldo**: Scripts `one-click` de despliegue, smoke tests, pruebas de carga (ab/hey) y backup/restore.

---

## 📁 Estructura del Repositorio

```
praEXAM/
├── source/                  # Código fuente de las aplicaciones
│   ├── apis/
│   │   ├── catalog-api/     # Microservicio de catálogo (Node.js/Express)
│   │   ├── orders-api/      # Microservicio de pedidos
│   │   └── customers-api/   # Microservicio de clientes (Cifrado AES-256)
│   ├── legacy/              # Módulo PHP + Apache (/legacy/inventory)
│   └── frontend/            # Panel Admin PWA Mobile-First
├── deploy/                  # Manifiestos y scripts de infraestructura
│   ├── k8s/                 # YAMLs de Kubernetes (Deployments, Services, Ingress, Secrets)
│   ├── nginx/               # Nginx reverse proxy y script de certificados TLS
│   ├── observability/       # Prometheus, cAdvisor, Loki, Promtail & Grafana Dashboard
│   ├── seed/                # Semillas reproducibles (52 productos, 12 clientes cifrados)
│   ├── backup/              # Scripts de Backup y Restore (PostgreSQL)
│   └── scripts/             # Scripts One-Click de despliegue, smoke tests y carga
├── docs/                    # Documentación técnica completa
│   ├── ARCHITECTURE.md      # Diagrama lógico y de despliegue (Mermaid)
│   ├── RUNBOOK.md           # Guía de operación, healthchecks y roles
│   ├── DATA_POLICY.md       # Clasificación de datos en 3 niveles y matriz de controles
│   ├── SLA_AND_COMPARATIVE.md # SLAs, SLOs, Error Budget y Comparativa de Infraestructura
│   ├── THREAT_MODEL.md      # Modelo STRIDE y Hardening UFW
│   └── BITACORA.md          # Registro de hitos, commits y evidencias de consola
├── evidence/                # Guía y archivador de capturas y reportes
├── CHANGELOG.md             # Bitácora de tags y versiones v1 a v6
├── docker-compose.yml       # Orquestación "One-Click" local/VM
├── git_setup.sh             # Script de automatización Git (Ramas main/exam y Tags)
└── README.md                # Portada principal del proyecto
```

---

## 🚀 Guía de Importación de la VM y Despliegue "Enchufar y Correr"

### 1. Requisitos Recomendados de la VM
- **RAM**: 12 GB
- **vCPU**: 4 núcleos
- **Disco**: 80 GB
- **SO**: Ubuntu Server 22.04 LTS / Debian 12

### 2. Arranque One-Click de la Plataforma
Dentro de la terminal de la VM, ejecute los siguientes comandos:

```bash
# 1. Clonar o ingresar a la carpeta del proyecto
cd praEXAM

# 2. Dar permisos de ejecución a los scripts
chmod +x deploy/scripts/*.sh deploy/backup/*.sh deploy/nginx/*.sh git_setup.sh

# 3. Inicializar Repositorio Git y Tags (v1-Infraestructura .. v6-Documentos)
./git_setup.sh

# 4. Ejecutar Despliegue One-Click
bash deploy/scripts/deploy_one_click.sh
```

---

## 🧪 Pruebas y Verificación de Criterios de Aceptación

### A. Endpoints de Salud (Healthchecks)
- `https://localhost/api/catalog/healthz` -> `{"status":"ok"}`
- `https://localhost/api/orders/healthz` -> `{"status":"ok"}`
- `https://localhost/api/customers/healthz` -> `{"status":"ok"}`
- `https://localhost/legacy/healthz` -> `{"status":"ok"}`

### B. Módulo Legado
- `https://localhost/legacy/inventory?sku=SKU-TAR-001` -> Retorna JSON con existencias de bodega.

### C. Evidencia de Cifrado AES-256 de Cédulas
- La UI y API en `https://localhost/api/customers` muestran el número de cédula en claro (`101110222`).
- El endpoint `https://localhost/api/customers/debug/raw-db` muestra el `SELECT` directo a la base de datos con el campo encriptado en ciphertext: `3a9b1c2d3e4f5a6b...`

### D. Observabilidad y Dashboards
- **Grafana**: Disponible en `http://localhost:5555` (Usuario: `admin`, Clave: `boreal2026`).
- Incluye métricas de CPU/Memoria por contenedor vía cAdvisor y visor de logs Loki con filtros por etiqueta.

---

## 🛡️ Frase Única Anti-Fraude
La frase única acordada se encuentra registrada en el encabezado de `deploy/nginx/nginx.conf`, en la página About del Panel Admin PWA y en toda la documentación oficial:

> **"café frío, LO cálido, ¡no puedo perderlo!"**
