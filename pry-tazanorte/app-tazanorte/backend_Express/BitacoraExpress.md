# BITACORA PASO A PASO DE BACKEND EXPRESS

# EVIDENCIAS

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

### Repository

![](images/clipboard-4262026794.png)

![](images/clipboard-959770312.png)

### Service

![](images/clipboard-678502013.png)

![](images/clipboard-3870607747.png)

![](images/clipboard-3062626506.png)

### Controller

![](images/clipboard-1665741401.png)

### Routes

![](images/clipboard-444513639.png)

### HTTP

![](images/clipboard-1814202154.png)

### Verificación

![](images/clipboard-3991406333.png)

## ISS-03-E: Eliminar (físico y lógico)

### Repository

![](images/clipboard-2208189930.png)

### Service

![](images/clipboard-3920522060.png)

![![](images/clipboard-1510529925.png)](images/clipboard-815041473.png)

### Controller

![![](images/clipboard-1073361210.png)](images/clipboard-4172709182.png)

### Routes

![](images/clipboard-3104889206.png)

### HTTP

![](images/clipboard-4107791472.png)

### Verficación

![![](images/clipboard-646130957.png)](images/clipboard-2422431848.png)

## ISS-04: Seeders con Faker

### 9.1 Seeder del feature Client

![](images/clipboard-2025478266.png)

![](images/clipboard-510123619.png)

### 9.2 Conteos y runner

![](images/clipboard-2080236713.png)

![![](images/clipboard-432538309.png)](images/clipboard-672175169.png)

![![](images/clipboard-163100583.png)](images/clipboard-2155426218.png)

## ISS-05: Swagger / OpenAPI

### 10.1 OpenAPI del feature Client

![![](images/clipboard-1655294247.png)](images/clipboard-3996787255.png)

### 10.2 Registry externo y montaje en Config

![](images/clipboard-862453156.png)

![](images/clipboard-2845378070.png)

![](images/clipboard-3826633451.png)

![](images/clipboard-2149590757.png)

![](images/clipboard-578979392.png)

## ISS-06: Feature Product (productos)

### 11.1 Carpetas y modelo

![](images/clipboard-2348175441.png)

### 11.2 DTOs

![](images/clipboard-2735507696.png)

### 11.3 Repository, Service, Controller y Routes

#### Repository

![](images/clipboard-1448368466.png)

#### Service

![](images/clipboard-979949265.png)

![](images/clipboard-1570318709.png)

![](images/clipboard-3147349417.png)

#### Controller

![](images/clipboard-2282340356.png)

![](images/clipboard-3449828400.png)

#### Routes

![](images/clipboard-3338724165.png)

## 11.4 Archivos `.http` (REST Client)

![](images/clipboard-2628330995.png)

## 11.5 Seeder

![](images/clipboard-129535597.png)

## 11.6 Swagger

![![](images/clipboard-2261543418.png)](images/clipboard-3522759735.png)

![![](images/clipboard-3900077679.png)](images/clipboard-3509892047.png)

## 11.7 Cableado 

![](images/clipboard-2771556357.png)

### Verificación ISS-06

![![](images/clipboard-1630452207.png)](images/clipboard-4165136416.png)

![![](images/clipboard-734800930.png)](images/clipboard-199167993.png)

## ISS-07: Empleado e Insumo

## Helper compartido de Swagger 

![](images/clipboard-264492010.png)

## ISS-07-A: Feature Employee (Empleado)

### Modelo y DTOs

![![](images/clipboard-4292104799.png)](images/clipboard-2737197696.png)

![![](images/clipboard-3633401410.png)](images/clipboard-3276733328.png)

![![](images/clipboard-2469807209.png)](images/clipboard-2047549385.png)

![](images/clipboard-2884169055.png)

## Repository, Service, Controller y Routes

![![](images/clipboard-2905925923.png)![](images/clipboard-815868403.png)](images/clipboard-4038095020.png)

![![](images/clipboard-3976731548.png)](images/clipboard-1669109617.png)

![![](images/clipboard-1674208972.png)](images/clipboard-433642445.png)

![](images/clipboard-2522641669.png)

## Archivos `.http`

![](images/clipboard-1351997511.png)

## Seeder y Swagger

![](images/clipboard-1043340742.png)

![](images/clipboard-1720204443.png)

## Cableado

![](images/clipboard-101167385.png)

## Verificación ISS-07-A

![![](images/clipboard-3158530421.png)](images/clipboard-1098291745.png)

![](images/clipboard-2975842907.png)

## ISS-07-B: Feature Supply (Insumo)

## Modelo y DTOs

![![](images/clipboard-234732212.png)](images/clipboard-2776995034.png)

![![](images/clipboard-4209664085.png)](images/clipboard-4074665266.png)

![](images/clipboard-3266229449.png)

## Repository, Service, Controller y Routes

![![](images/clipboard-1580926198.png)](images/clipboard-1980939962.png)

![![](images/clipboard-327399059.png)](images/clipboard-1634636765.png)

![](images/clipboard-1224653237.png)

![![](images/clipboard-3376064729.png)](images/clipboard-212304217.png)

![](images/clipboard-1613984509.png)

![](images/clipboard-593962382.png)

## Archivos `.http`

![](images/clipboard-1340825087.png)

## Seeder y Swagger

![](images/clipboard-3761052025.png)

![](images/clipboard-8863419.png)

## Cableado

![](images/clipboard-2306830240.png)

## Verificación ISS-07-B

![](images/clipboard-3471221407.png)

![](images/clipboard-1000175602.png)

![](images/clipboard-2110497930.png)

## ISS-08: TurnoCaja

##  Mejora en `BaseController`

![](images/clipboard-795907986.png)

## Modelo, relación y DTOs

![](images/clipboard-381849241.png)

![](images/clipboard-2052834996.png)

![![](images/clipboard-3978091437.png)](images/clipboard-1849121511.png)

![![](images/clipboard-2834040637.png)](images/clipboard-3383754419.png)

![](images/clipboard-3296611764.png)

## Repository, Service, Controller y Routes

![![](images/clipboard-3717206956.png)](images/clipboard-1785569684.png)

![](images/clipboard-4039906018.png)

![![](images/clipboard-4293676555.png)](images/clipboard-833973634.png)

![![](images/clipboard-1994758819.png)](images/clipboard-832678514.png)

![![](images/clipboard-4002552474.png)](images/clipboard-2441316125.png)

![](images/clipboard-4069937409.png)

## Archivos `.http`

![](images/clipboard-1653130525.png)

## Seeder y Swagger

![](images/clipboard-2580208467.png)

![](images/clipboard-806017099.png)

## Cableado

![](images/clipboard-71145083.png)

## Verificación ISS-08

![](images/clipboard-17654541.png)

![](images/clipboard-1398601733.png)

![](images/clipboard-2830273846.png)

## ISS-09-: Feature OrderItem (PedidoDetalle)

## Modelo, relación y DTOs

![](images/clipboard-996931086.png)

![![](images/clipboard-4068048845.png)](images/clipboard-2169004235.png)

![![](images/clipboard-280493132.png)](images/clipboard-3108813271.png)

![](images/clipboard-3493097886.png)

## Repository, Service, Controller y Routes

![![](images/clipboard-2775622685.png)](images/clipboard-2073365068.png)

![![](images/clipboard-822346901.png)](images/clipboard-1242249634.png)

![](images/clipboard-3323988620.png)

![![](images/clipboard-2372571850.png)](images/clipboard-1546013905.png)

![![](images/clipboard-1147763467.png)](images/clipboard-1764784622.png)

## Archivos `.http`

![](images/clipboard-2912866573.png)

## Seeder y Swagger

![![](images/clipboard-3726407956.png)](images/clipboard-1131323045.png)

![![](images/clipboard-4142983489.png)](images/clipboard-1650840229.png)

![](images/clipboard-4189446465.png)

## Cableado

![](images/clipboard-1538832317.png)

## Verificación

![](images/clipboard-1852225812.png)

![](images/clipboard-3524211575.png)

![](images/clipboard-3027570491.png)

## ISS-10: Pedido

## Modelo, relación y DTOs

![](images/clipboard-3862282791.png)

![](images/clipboard-3330768052.png)

![](images/clipboard-1727807500.png)

![](images/clipboard-1011281829.png)

![](images/clipboard-1428832649.png)

![](images/clipboard-2754010032.png)

![](images/clipboard-3730214383.png)

## Repository, Service, Controller y Routes

![](images/clipboard-3669781040.png)

![](images/clipboard-74234586.png)

![](images/clipboard-1897535950.png)

![](images/clipboard-1790805451.png)

![](images/clipboard-3517196030.png)

![](images/clipboard-3539762853.png)

![](images/clipboard-1472766667.png)

![](images/clipboard-2636264478.png)

![](images/clipboard-2540515329.png)

![](images/clipboard-2935479616.png)

![](images/clipboard-523806774.png)

![](images/clipboard-2027334693.png)

![](images/clipboard-3992882875.png)

## Archivos `.http`

![![](images/clipboard-267563524.png)](images/clipboard-2832759319.png)

![![](images/clipboard-737841132.png)](images/clipboard-383073615.png)

![](images/clipboard-302816116.png)

## Seeder y Swagger

![](images/clipboard-1086894614.png)

![](images/clipboard-2920932138.png)

![](images/clipboard-849399148.png)

![](images/clipboard-372744714.png)

![](images/clipboard-958123164.png)

![](images/clipboard-1112264380.png)

## Cableado

![](images/clipboard-2806189576.png)

## Verificación

![](images/clipboard-4110508063.png)

![![](images/clipboard-1084979947.png)](images/clipboard-2733710898.png)
