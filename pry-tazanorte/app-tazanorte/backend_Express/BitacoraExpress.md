# BITACORA PASO A PASO DE BACKEND EXPRESS 

#                                 EVIDENCIAS

## DEISIREED CASTAÑEDA OVIEDO

## ISS-00: Requisitos previos

### 1. Verificar Node y npm.

![](images/clipboard-4262970215.png)

2\. Verificar que los motores de BD en Docker están arriba.

![](images/clipboard-1613799811.png)

## ISS-01: Esqueleto del proyecto

#### 2.1 Inicializar npm y scripts

![](images/clipboard-1654006853.png)

![](images/clipboard-2131972088.png)

### 2.2 Estructura de carpetas

![](images/clipboard-1200118517.png)

### 2.3 Dependencias base

![](images/clipboard-1541951618.png)

### 2.4 `tsconfig.json`

![](images/clipboard-2114241290.png)

### 2.5 Servidor y App

![](images/clipboard-3058315834.png)

![](images/clipboard-409757514.png)

![](images/clipboard-3062894939.png)

![](images/clipboard-3864816247.png)

## ISS-02: Infraestructura de base de datos

### 3.1 Drivers de Sequelize y `.env`

![](images/clipboard-2624278356.png)

![](images/clipboard-2583979560.png)

![](images/clipboard-4165331832.png)

### 3.2 Crear `src/database/db.ts`

![](images/clipboard-2823566844.png)

### 3.3 Carpeta de seeders

![![](images/clipboard-3294968030.png)](images/clipboard-1795090140.png)

![](images/clipboard-2232121356.png)

## ISS-03-A: Fundación

### 4.0 Capa compartida `shared/`

![![](images/clipboard-3103845163.png)](images/clipboard-2614566608.png)

![](images/clipboard-2306733247.png)

![](images/clipboard-2206001474.png)

### 4.1 Modelo `Client`

![](images/clipboard-2066534653.png)

### 4.2 DTOs

![](images/clipboard-3790777542.png)

#### Repository

![](images/clipboard-3903841851.png)

#### Service

![](images/clipboard-102180088.png)

### Controller

![](images/clipboard-1831345539.png)

#### Routes

![](images/clipboard-3667374115.png)

### 4.3 Agregador de rutas y `config/index.ts`

![](images/clipboard-2388406169.png)

![](images/clipboard-3162303467.png)

![](images/clipboard-4051665175.png)

![](images/clipboard-2419956136.png)

### Verificación 

![](images/clipboard-3686764562.png)

![](images/clipboard-1734030478.png)

## ISS-03-B: GetAll y GetOne

### Repository

![](images/clipboard-159786707.png)

### Service

![](images/clipboard-4133541548.png)

![](images/clipboard-2297241240.png)

![](images/clipboard-1244720914.png)

### Controller

![](images/clipboard-1857925118.png)

![](images/clipboard-2140254428.png)

### Routes

![](images/clipboard-1950832965.png)

### HTTP (REST Client)

![](images/clipboard-2318981948.png)

### Verificación

![](images/clipboard-2348283970.png)

### ISS-03-C: Crear cliente

### Repository

![](images/clipboard-739103849.png)

### Services

![](images/clipboard-2007663960.png)

### Controller

![](images/clipboard-2817009574.png)

### Routes

![](images/clipboard-3974290299.png)

### HTTP

![](images/clipboard-4144101022.png)

### Verificación ISS-03-C

![](images/clipboard-2249159485.png)

### ISS-03-D: Update (PUT) y Update (PATCH)

### 
