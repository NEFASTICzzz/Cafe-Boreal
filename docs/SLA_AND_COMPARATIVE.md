# SLA Interno, SLOs & Comparativa de Modelos de Despliegue: Café Boreal S.R.L.

---

## 1. Definición de SLAs Internos y Presupuesto de Error

Para la plataforma transaccional de Café Boreal S.R.L., se han definido las siguientes 3 métricas de nivel de servicio (SLO):

| Métrica | SLA Objetivo | SLO (Service Level Objective) | Presupuesto de Error (Error Budget) |
|---|---|---|---|
| **Disponibilidad del Sistema (%)** | 99.9% / mes | 99.95% de peticiones exitosas (HTTP 2xx/3xx) | 0.05% de fallos permitidos (~21.6 min/mes) |
| **Latencia p95 (Respuesta API)** | < 200 ms | 95% de las solicitudes atendidas en ≤ 150 ms | 5% de peticiones pueden superar los 150 ms |
| **Tiempo Medio de Recuperación (MTTR)** | < 15 minutos | MTTR automatizado ≤ 5 minutos (auto-healing K8s) | N/A |

---

## 2. Comparativa de Modelos de Infraestructura (On-Premise vs IaaS vs PaaS vs Híbrido)

| Criterio | On-Premise (VM Local) | IaaS (AWS EC2 / Azure VM) | PaaS (Azure App Service / Heroku) | Híbrido (K8s en Cloud + On-Prem) |
|---|---|---|---|---|
| **Costo Inicial (CAPEX)** | Alto (Servidores, UPS) | Bajo (Pago por uso) | Nulo | Moderado |
| **Costo Operativo (OPEX)** | Mantenimiento físico elevado | Moderado (Gestión de OS/K8s) | Mayor por recurso | Balanceado |
| **Control & Flexibilidad** | Total | Alto | Limitado por el proveedor | Total |
| **Escalabilidad** | Limitada al Hardware | Alta (Auto-scaling VMs) | Instantánea (Auto-scale PaaS) | Dinámica y Elástica |
| **Esfuerzo de Mantenimiento** | Muy Alto | Moderado | Muy Bajo | Moderado-Alto |
| **Costo Estimado MiPyME/Mes** | ~$150 (Electricidad/Net) | ~$280 USD | ~$450 USD | ~$320 USD |

---

## 3. Conclusión Argumentada Técnico-Económica para la MiPyME

Para la escala actual de **Café Boreal S.R.L.** (MiPyME costarricense):
1. **Recomendación Inicial**: Iniciar con un esquema **PaaS / Contenedores Administrados (ej. Azure Container Apps o AWS ECS / DigitalOcean Kubernetes)**.
2. **Justificación Técnica**: Elimina la complejidad del mantenimiento de la capa de hardware y el sistema operativo básico, permitiendo al equipo de desarrollo enfocar sus esfuerzos en la lógica de los microservicios (`catalog`, `orders`, `customers`) y en la seguridad de los datos.
3. **Justificación Económica**: Un esquema PaaS evita compras de hardware costoso (CAPEX) y ofrece escalado vertical/horizontal según las temporadas de alta demanda de café (ej. Black Friday o temporada navideña), optimizando el presupuesto operativo (OPEX) por debajo de $200 USD mensuales.
