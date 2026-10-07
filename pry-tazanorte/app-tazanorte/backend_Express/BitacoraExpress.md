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

## Mejora en `BaseController`

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

## ISS-11 — Feature SupplyOrderItem (InsumoPedidoDetalle)

## Modelo, Relación y DTOs

![](images/clipboard-624501167.png)

![![](images/clipboard-3162686034.png)](images/clipboard-4183031699.png)

![](images/clipboard-365540882.png)

![![](images/clipboard-3798097896.png)](images/clipboard-2113658440.png)

![![](images/clipboard-2220616525.png)](images/clipboard-901506114.png)

## Repository, Service, Controller y Routes

![![](images/clipboard-3512413558.png)](images/clipboard-2687610736.png)

![![](images/clipboard-1297453007.png)](images/clipboard-1351523123.png)

![](images/clipboard-2416420281.png)

## Archivos `.http`

![](images/clipboard-3189943790.png)

## Seeder y Swagger

![](images/clipboard-1320333575.png)

![](images/clipboard-2090022111.png)

## Verificación

![](images/clipboard-2861659705.png)

![](images/clipboard-2235893882.png)

![![](images/clipboard-1034998999.png)](images/clipboard-1034998999.png)

## ISS-12 Feature Payment (Pago)

## Modelo, Relación y DTOs

![](images/clipboard-3052225304.png)

![](images/clipboard-2705020222.png)

![](images/clipboard-2880059331.png)

## Repository, Service, Controller y Routes

![](images/clipboard-2915625827.png)

![](images/clipboard-1524268685.png)

![](images/clipboard-4133554735.png)

![](images/clipboard-2837294128.png)

## Archivos `.http`

## Seeder y Swagger

![](images/clipboard-3008208825.png)

![](images/clipboard-2893881187.png)

## Verificación

![](images/clipboard-2335627915.png)

![](images/clipboard-3576412489.png)

## ISS-13: Puntos de Fidelización

## Repository, Service, Controller y Routes

![](images/clipboard-836462837.png)

![](images/clipboard-2565219749.png)

![](images/clipboard-2920446436.png)

## Seeder y Swagger

![](images/clipboard-2332851604.png)

## Verificación

![![](images/clipboard-1474548082.png)](images/clipboard-2548584321.png)

![](images/clipboard-2501690256.png)

# ISS-14: Base de seguridad y modelos Auth

## 14.0 Prerrequisitos

![](images/clipboard-2732260846.png)

## 14.1 Dependencias y variables de entorno

![![](images/clipboard-387955260.png)](images/clipboard-3850610921.png)

## 14.2 `password.ts`

![](images/clipboard-3017294878.png)

## 14.3 `jwt.ts`

![](images/clipboard-2201154112.png)

## 14.4 `resource-match.ts`

![](images/clipboard-3467073777.png)

## 14.5 `auth-user.ts`

![](images/clipboard-2316611551.png)

## 14.6 `error-response.ts` y parche de `BaseController`

![](images/clipboard-271164872.png)

## 14.7 `swagger-security.ts`

![](images/clipboard-2898093292.png)

## 14.8 Los seis modelos

**`User`**:

![](images/clipboard-242698672.png)

### Role:

![](images/clipboard-2505575254.png)

### Resource:

![](images/clipboard-1337138407.png)

**`RoleUser`**:

![](images/clipboard-3853927546.png)

### ResourceRole:

![](images/clipboard-3842465894.png)

### RefreshToken:

![](images/clipboard-156230507.png)

## 14.9 `rbac.associations.ts`

![](images/clipboard-2968310401.png)

## ISS-15: Feature Users (Identidad y Gestión de Usuarios)

## 1. DTO

![](images/clipboard-2244963473.png)

## 2. Repository

![](images/clipboard-987846890.png)

## 3. Service

![](images/clipboard-998176641.png)

## 4. Controller

![](images/clipboard-1585690276.png)

### 5. Routes

![](images/clipboard-2131765403.png)

## ISS-16: Features Roles y Resources (Catálogo RBAC)

## 16.0 Comprobaciones previas

![](images/clipboard-2887804129.png)

## 16.1 Roles — DTOs

![](images/clipboard-613821358.png)

## 16.2 Roles — repository

![](images/clipboard-2844028942.png)

## 16.3 Roles — service

![](images/clipboard-3268335645.png)

## 16.4 Roles — controller

![](images/clipboard-2463940598.png)

## 16.5 Roles — Routes

![](images/clipboard-2606005431.png)

## 16.6 Roles — Feature Resources — DTO 

![](images/clipboard-875774055.png)

## 16.7 Roles — Feature Resources — repository

![](images/clipboard-54100922.png)

## 16.8 Roles — Feature Resources — service

![](images/clipboard-2827121010.png)

## 16.9 Roles — Feature Resources — controller

![](images/clipboard-140705573.png)

## 16.10 Roles — Feature Resources — routes

![](images/clipboard-4168334520.png)

## 16.11 Verificación

![](images/clipboard-3893708081.png)

## ISS-17: Features RoleUsers y ResourceRoles (Asignaciones RBAC)

### 17.1 Feature RoleUsers — DTO 

![](images/clipboard-2615660438.png)

### 17.2 Feature RoleUsers — repository 

![](images/clipboard-277791435.png)

### 17.3 Feature RoleUsers — service

![](images/clipboard-3124503241.png)

### 17.4 Feature RoleUsers — controller

![](images/clipboard-2400725922.png)

### 17.5 Feature RoleUsers — routes

![](images/clipboard-2850136124.png)

### 17.6 Feature ResourceRoles—DTO

![](images/clipboard-3034530558.png)

### 17.7 Feature ResourceRoles—repository

![](images/clipboard-1434085928.png)

### 17.8 Feature ResourceRoles—service

![](images/clipboard-1630875460.png)

### 17.9 Feature ResourceRoles—controller

![](images/clipboard-1281122176.png)

### 17.10 Feature ResourceRoles—routes

![](images/clipboard-2776771217.png)

### 17.11 Verificación

![](images/clipboard-4294111544.png)

## **ISS-18: Feature Auth (Flujo de Autenticación JWT y Refresh Tokens)**.

![![](images/clipboard-1661041336.png)](images/clipboard-984662249.png)

![](images/clipboard-233736741.png)

## ISS-19: Middlewares de Autenticación y Autorización (RBAC Guard)

![](images/clipboard-3233991527.png)

![](images/clipboard-1894531920.png)

\
![](images/clipboard-4203775094.png)

##  ISS-20: Router Central y Entrypoint Server

![](images/clipboard-1606321169.png)

![](images/clipboard-320291478.png)

![](images/clipboard-722968855.png)

## ISS-21: Seeding y Verificación Final

![](images/clipboard-318251105.png)

![](images/clipboard-694528696.png)

**Verifica la compilación final**:

![**Ejecuta el Seeding para popular tu base de datos**:](images/clipboard-1465237055.png)

![](images/clipboard-3825560982.png)

**Inicia el servidor en modo desarrollo**:

![](images/clipboard-1863547071.png)

![](images/clipboard-2947370699.png)

![](images/clipboard-2340114601.png)
