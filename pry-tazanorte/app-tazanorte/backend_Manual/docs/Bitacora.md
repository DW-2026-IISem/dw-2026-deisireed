# Manual de creación del Backend — NestJS + Sequelize (Clean Architecture)

Deisireed Castañeda

## FASE 1 — `00_BASE_INIT_NESTJS`

### Inicialización del proyecto NestJS

> **Objetivo de la fase:** Dejar el esqueleto oficial Nest corriendo en un puerto libre, con Git inicial.

#### 1.1 — Crear carpetas padre y permisos

``` bash
mkdir -p /home/portatiljq/apps/dlloweb/nestjs/express_sequelize 
chmod -R 755 /home/portatiljq/apps/dlloweb/nestjs/express_sequelize
```

![](images/clipboard-266895551.png)

**Sugerencia de commit (issue):**

``` bash
git add . 
git commit -m "chore: prepare workspace folders for nest backend"
```

#### 1.2 — Instalar Nest CLI (si no existe)
