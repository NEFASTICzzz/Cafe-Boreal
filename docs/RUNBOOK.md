# RunBook de Operación y Mantenimiento: Café Boreal S.R.L.

Este documento contiene los procedimientos operativos estándar para el arranque, monitoreo de salud, respalda/restauración de datos y gestión de accesos.

---

## 1. Procedimiento de Arranque Inicial en Oracle VM VirtualBox ("Enchufar y Correr")

1. Importar la VM `.ova` (`CafeBoreal_VM_Entrega.ova`) en Oracle VM VirtualBox:
   - Menú `Archivo` -> `Importar servicio virtual...` -> Seleccionar el archivo `.ova`.
2. Configurar o verificar los recursos asignados a la VM:
   - **vCPU**: 4 núcleos
   - **RAM**: 12 GB (Mínimo 8 GB)
   - **Disco**: 80 GB
   - **Red**: Adaptador NAT con Reenvío de Puertos (Ports: 80->80, 443->443, 5555->5555, 2222->22) o Adaptador Puente (Bridged).
3. Encender la VM e iniciar sesión (Usuario: `boreal`, Password: `boreal_password_2026`).
4. Abrir la terminal dentro de la VM y ejecutar el script one-click:
   ```bash
   cd /home/boreal/praEXAM
   bash deploy/scripts/deploy_one_click.sh
   ```
5. Verificar el acceso en navegador (Host / VM):
   - **Front-End PWA**: `https://localhost/`
   - **Dashboard Grafana**: `http://localhost:5555`

---

## 2. Health-Checks y Verificación de Estado

Para validar rápidamente el estado de la infraestructura y microservicios:

```bash
# Verificación de pods en Kubernetes
kubectl get pods -n cafe-boreal

# Verificación de servicios
kubectl get svc -n cafe-boreal

# Ejecutar smoke tests automáticos
bash deploy/scripts/smoke_tests.sh
```

Endpoints de Salud Individuales:
- `https://localhost/api/catalog/healthz` -> `{"status":"ok"}`
- `https://localhost/api/orders/healthz` -> `{"status":"ok"}`
- `https://localhost/api/customers/healthz` -> `{"status":"ok"}`
- `https://localhost/legacy/healthz` -> `{"status":"ok"}`

---

## 3. Procedimiento de Respaldo y Restauración (Backup & Restore)

### Generación de Respaldo Manual
```bash
bash deploy/backup/backup.sh
```
El dump comprimido `.sql.gz` se guardará en `deploy/backup/dumps/` con marca de tiempo.

### Restauración de Respaldo
```bash
bash deploy/backup/restore.sh deploy/backup/dumps/boreal_db_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## 4. Matriz de Usuarios y Roles

| Usuario / Rol | Nivel de Acceso | Método de Autenticación | Alcance |
|---|---|---|---|
| `admin` | Total (Root / K8s Admin) | SSH Key / Credencial VM | Infraestructura, Secrets K8s, Logs |
| `operator` | Operativo / Monitoreo | Credencial Grafana (`admin:boreal2026`) | Dashboards Grafana, Loki Logs |
| `app_user` | Usuario Admin Panel PWA | HTTPS Session | Gestión de Productos, Pedidos, Clientes |
