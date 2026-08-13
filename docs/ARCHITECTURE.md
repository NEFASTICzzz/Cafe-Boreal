# Arquitectura y Despliegue: Café Boreal S.R.L.

Este documento describe la arquitectura lógica y de infraestructura física/virtual del sistema integrado para **Café Boreal S.R.L.** (Universidad Técnica Nacional - ITI-522 Computación en la Nube).

---

## 1. Diagrama Lógico de la Arquitectura

```mermaid
graph TD
    Client[Cliente / Navegador Web / PWA Mobile-First] -->|HTTPS :443| NginxProxy[Nginx Frontal Proxy + TLS Autofirmado]

    subgraph "Contenedor / Cluster K8s Local"
        NginxProxy -->|/api/catalog| CatalogAPI[Catalog API - Node.js :3001]
        NginxProxy -->|/api/orders| OrdersAPI[Orders API - Node.js :3002]
        NginxProxy -->|/api/customers| CustomersAPI[Customers API - Node.js :3003]
        NginxProxy -->|/legacy/*| LegacyApp[Legacy Inventory Module - Apache/PHP :80]
        NginxProxy -->|/| FrontendApp[Admin Panel PWA - Nginx :80]

        CustomersAPI -->|AES-256 Key de Secret| K8sSecret[K8s Secret: customers-secret]
        CatalogAPI --> PostgreSQL[(PostgreSQL Database :5432)]
        OrdersAPI --> PostgreSQL
        CustomersAPI -->|Cifrado en Almacenamiento| PostgreSQL
    end

    subgraph "Suite de Observabilidad"
        Prometheus[Prometheus Server :9090] -->|Scrape Metrics| cAdvisor[cAdvisor :8080]
        Prometheus -->|Scrape Metrics| CatalogAPI
        Prometheus -->|Scrape Metrics| OrdersAPI
        Prometheus -->|Scrape Metrics| CustomersAPI

        Promtail[Promtail Agent] -->|Lee Container Logs| Loki[Loki Log Aggregator :3100]
        Grafana[Grafana Dashboard :5555] -->|Consulta Métricas| Prometheus
        Grafana -->|Consulta Logs por Labels| Loki
    end
```

---

## 2. Diagrama de Despliegue (Infraestructura de VM Única)

```mermaid
graph LR
    subgraph "Hyper-V / VirtualBox / VMware VM (Ubuntu Server 22.04 LTS)"
        subgraph "Network: Host/Bridge Interface"
            Port80[Port 80: HTTP Redirect]
            Port443[Port 443: HTTPS SSL]
            Port5555[Port 5555: Grafana]
        end

        subgraph "Docker Engine & K3s/Minikube Runtime"
            NginxContainer[Nginx Frontal Container]
            PostgresContainer[PostgreSQL DB Container + PVC]
            CatalogContainer[Catalog Pod - non-root]
            OrdersContainer[Orders Pod - non-root]
            CustomersContainer[Customers Pod - non-root]
            LegacyContainer[Apache PHP Legacy Container]
            FrontendContainer[Frontend PWA Container]
            ObsStack[Prometheus + Grafana + Loki + Promtail + cAdvisor]
        end
    end

    Port80 --> NginxContainer
    Port443 --> NginxContainer
    Port5555 --> ObsStack
```

---

## 3. Decisiones de Diseño y Trade-Offs

1. **Monolito Legado vs Microservicios Nativos**:
   - *Decisión*: Se mantiene el módulo `/legacy/inventory` aislado en Apache+PHP para respetar el principio de no interferencia con sistemas legados mientras los nuevos microservicios (`catalog`, `orders`, `customers`) se construyen con arquitectura cloud-native no-root en Kubernetes/Docker.
2. **Cifrado en Capa de Aplicación con AES-256-CBC**:
   - *Decisión*: Se utiliza la librería `crypto` estándar de Node.js en `customers-api` para cifrar la cédula/identidad antes de realizar el `INSERT` en PostgreSQL. La clave de 256 bits se inyecta dinámicamente desde un Kubernetes Secret (`customers-secret`). Esto garantiza que ni backups de DB ni consultas `SELECT` directas expongan datos confidenciales sin descifrado en la API/UI.
3. **Observabilidad Ligera (Prometheus + cAdvisor + Loki + Grafana)**:
   - *Decisión*: Se seleccionó Loki en lugar de Elasticsearch debido al bajo consumo de recursos (ideal para la VM única de 12GB RAM) manteniendo filtrado potente por etiquetas (`job`, `pod`, `namespace`).
