# **Bitacora**

## **Paso a paso del Fronted**

#### **Deisireed Castañeda**

#### **Desarrollo Web**

# FASE 1

# ISS-00 · Requisitos previos

## Objetivo

Dejar el equipo listo para construir el frontend: Node, npm, Angular CLI, navegador, backend Express corriendo y base de datos sembrada. Al terminar este ISS no se ha escrito código de Angular todavía; solo se comprueba el entorno.

## 0.1 Versiones del laboratorio

```         
node -v
npm -v
npx @angular/cli@22 version
```

![](images/clipboard-2830867610.png){width="552"}

## 0.2 Backend en marcha

El frontend **no funciona solo**: consume la API en `http://localhost:4000/api`. Levanta el backend **correcto**:

```         

npm run dev
```

![](images/clipboard-1740724689.png)

## 0.3 Login y permisos

El login del backend devuelve **solo el par de tokens**. El perfil y los permisos se piden aparte:

```         
# 1. Login (OPEN)
curl -s -X POST http://localhost:4000/api/sesion/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}'
```

![](images/clipboard-1888295296.png)

```         
# 2. Perfil (JWT)
curl -s http://localhost:4000/api/sesion/perfil \
  -H "Authorization: Bearer $TOKEN"
```

![](images/clipboard-3669693423.png)

```         
# 3. Permisos efectivos (JWT)
curl -s http://localhost:4000/api/permisos \
  -H "Authorization: Bearer $TOKEN"
```

![](images/clipboard-3906189391.png)

## Comprobación final

```         
# 1. Versiones
node -v && npm -v && npx @angular/cli@22 version

# 2. Backend vivo
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:4000/api/clientes

# 3. Login + permisos
TOKEN=$(curl -s -X POST http://localhost:4000/api/sesion/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"admin","password":"Admin123!"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

curl -s http://localhost:4000/api/permisos \
  -H "Authorization: Bearer $TOKEN" | head -c 300
```

![](images/clipboard-1915609307.png)

# 

# ISS-01 · Bootstrap Angular 22 con CLI, Tailwind y PrimeNG

# 

## Objetivo

Crear el proyecto Angular 22 **sin una carpeta adicional**, integrar Tailwind CSS 4, instalar PrimeNG 22 y dejar el tema Aura funcionando. Al final, `ng serve` debe mostrar la pantalla inicial sin errores.

## 1.1 Crear el proyecto en la carpeta actual

```         
 npx @angular/cli@22 new front-storelab-express-ii \   --directory . \   --style=tailwind \   --ssr=false \   --routing \   --zoneless \   --skip-git \   --package-manager=npm 
```

![](images/clipboard-3704845219.png)![](images/clipboard-4056621551.png)

## .2 Instalar PrimeNG compatible con Angular

Consulta primero las peer dependencies:

```         
ng version npm view primeng version peerDependencies --json npm install primeng @primeuix/themes primeicons @angular/cdk 
```

Verifica versiones:

```         
npm ls primeng @primeuix/themes primeicons @angular/cdk --depth=0 
```

![](images/clipboard-3227647826.png)

## 1.3 Estilos globales

Crea/reemplaza `src/styles.css`:

```         
cat > src/styles.css <<'EOF' @layer theme, base, primeng, utilities; @import 'tailwindcss'; @import 'primeicons/primeicons.css'; EOF 
```

![](images/clipboard-1873266414.png)

## 1.4 Configurar PrimeNG en `app.config.ts`

Reemplaza `src/app/app.config.ts`:

```         
cat > src/app/app.config.ts <<'EOF' import {   ApplicationConfig,   provideBrowserGlobalErrorListeners, } from '@angular/core'; import {   provideRouter,   withComponentInputBinding,   withInMemoryScrolling, } from '@angular/router'; import { ConfirmationService, MessageService } from 'primeng/api'; import { providePrimeNG } from 'primeng/config'; import Aura from '@primeuix/themes/aura'; import { environment } from '../environments/environment';  import { routes } from './app.routes';  export const appConfig: ApplicationConfig = {   providers: [     provideBrowserGlobalErrorListeners(),      provideRouter(       routes,       withComponentInputBinding(),       withInMemoryScrolling({ scrollPositionRestoration: 'top' }),     ),      // PrimeNG 22: tema Aura. El modo oscuro se activa con la clase .app-dark.     providePrimeNG({       license: environment.primeUiLicense || undefined,       ripple: true,       inputVariant: 'outlined',       theme: {         preset: Aura,         options: {           darkModeSelector: '.app-dark',           cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' },         },       },     }),      MessageService,     ConfirmationService,   ], }; EOF
```

![](images/clipboard-75580254.png)

![](images/clipboard-1600720974.png)

## 1.5 Pantalla de arranque: `App` compone el componente `demo/ejemplo`

**`src/app/app.ts`**

```         
cat > src/app/app.ts <<'EOF' import { Component } from '@angular/core'; import { Ejemplo } from './demo/ejemplo/ejemplo';  /**  * Componente principal (`<app-root>`).  *  * Es el primero que Angular dibuja. En ISS-01 solo compone el componente de  * ejemplo, para que se vea en pantalla con una etiqueta. Las rutas llegan en  * ISS-01B, cuando existe una pantalla de negocio que mostrar.  */ @Component({   host: { class: 'block' },   selector: 'app-root',   imports: [Ejemplo],   templateUrl: './app.html',   styleUrl: './app.css', }) export class App {} EOF
```

**`src/app/app.html`**

```         
cat > src/app/app.html <<'EOF' <!-- Marco de la aplicación: fondo, ancho máximo y padding con utilidades Tailwind. --> <main class="min-h-dvh bg-slate-50 p-6 text-slate-900">   <div class="mx-auto w-full max-w-4xl">     <!-- Composición: una etiqueta en la plantilla pinta el componente Ejemplo. -->     <app-ejemplo />   </div> </main> EOF
```

**`src/app/app.routes.ts`**

```         
cat > src/app/app.routes.ts <<'EOF' import { Routes } from '@angular/router';  /**  * Rutas de la aplicación.  *  * Vacío a propósito: en ISS-01 la pantalla se compone con etiquetas en `app.html`  * (`<app-ejemplo />`). El router se presenta en ISS-01B, con una pantalla real.  */ export const routes: Routes = []; EOF
```

**`src/app/app.css`**

```         
cat > src/app/app.css <<'EOF' /*  * Estilos propios del componente App.  *  * Queda VACÍO a propósito: el aspecto se resuelve con utilidades Tailwind en el  * HTML y con el tema Aura de PrimeNG (PATRON-VISUAL). Angular mantiene el archivo  * porque `styleUrl` lo referencia y solo afecta a `<app-root>`.  */ EOF
```

import { TestBed } from '\@angular/core/testing'; import { App } from './app';

describe('App', () =\> { beforeEach(async () =\> { await TestBed.configureTestingModule({ imports: [App], }).compileComponents(); });

it('should create the app', () =\> { const fixture = TestBed.createComponent(App); expect(fixture.componentInstance).toBeTruthy(); });

it('should render the example component', async () =\> { const fixture = TestBed.createComponent(App); await fixture.whenStable(); const compiled = fixture.nativeElement as HTMLElement; expect(compiled.querySelector('app-ejemplo')).toBeTruthy(); });

it('should show the product loaded by the example component', async () =\> { const fixture = TestBed.createComponent(App); await fixture.whenStable(); const compiled = fixture.nativeElement as HTMLElement; expect(compiled.textContent).toContain('Café molido 500 g'); }); });

![](images/clipboard-3543718809.png)

![](images/clipboard-291533995.png)

![](images/clipboard-2606528441.png)

## 1.6 Personalizar `index.html`

cat \> src/index.html \<\<'EOF' \<!doctype html\> \<html lang="es"\> \<head\> \<meta charset="utf-8"\> \<title\>StoreLab Express II · Angular 22\</title\> \<base href="/"\> \<meta name="viewport" content="width=device-width, initial-scale=1"\> \<meta name="description" content="Frontend Angular 22 con Signals, PrimeNG y Tailwind para StoreLab Express."\> \<link rel="icon" type="image/x-icon" href="favicon.ico"\> \</head\> \<body class="m-0 bg-slate-100 font-sans text-slate-900"\> \<app-root\>\</app-root\> \</body\> \</html\> EOF

![](images/clipboard-2722670974.png)

# 1.7 Ajuste de presupuesto

El bundle inicial con PrimeNG supera los 500 kB por defecto. En `angular.json`, dentro de `projects → ... → architect → build → configurations → production → budgets`, **cambia** el primer presupuesto:

```         
{   "type": "initial",   "maximumWarning": "750kB",   "maximumError": "1MB" }
```

![](images/clipboard-4204291375.png)

## 1.8 Primera ejecución

npm start

![](images/clipboard-3895065847.png)

![](images/clipboard-3958198079.png)

## 1.9 Anatomía del componente `demo/ejemplo` y signals

```         
src/app/demo/ejemplo/ ├── ejemplo.ts       ← la clase: estado, derivados, efecto y métodos ├── ejemplo.html     ← la plantilla: tarjetas, campos y botones ├── ejemplo.css      ← la excepción: una clase para explicar el aislamiento └── ejemplo.spec.ts  ← la prueba: crea el componente y comprueba el cambio de estado 
```

### 1.9.1 De `index.html` a la pantalla

```         
index.html    └─ <app-root></app-root>                  ← el HTML solo tiene esta etiqueta          │          ├─ src/main.ts                      bootstrapApplication(App, appConfig)          ├─ src/app/app.config.ts            providers globales (router, PrimeNG, …)          └─ src/app/app.ts                    clase App + @Component(...)                ├─ app.html                    plantilla: <main> + <app-ejemplo />                ├─ app.css                     estilos propios (vacío)                ├─ app.spec.ts                 pruebas de App                └─ app.routes.ts               rutas (vacío en ISS-01)                      │                      │  <app-ejemplo />  ← la etiqueta de app.html encuentra este componente                      ▼                src/app/demo/ejemplo/                      ├─ ejemplo.ts            clase Ejemplo + @Component(...)                      ├─ ejemplo.html          plantilla: las tres tarjetas                      ├─ ejemplo.css           una clase de demostración                      └─ ejemplo.spec.ts       4 pruebas 
```

### 1.9.2 Los cuatro archivos de un componente

```         
src/app/demo/ejemplo/ ├── ejemplo.ts        ← la clase (estado y lógica) + @Component(...) ├── ejemplo.html      ← la plantilla (lo que se ve) ├── ejemplo.css       ← los estilos de ESTE componente └── ejemplo.spec.ts   ← la prueba 
```

```         
@Component({   host: { class: 'block' },              // clases del elemento anfitrión <app-ejemplo>   selector: 'app-ejemplo',               // etiqueta HTML que lo representa   imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],   templateUrl: './ejemplo.html',         // vista externa   styleUrl: './ejemplo.css',             // estilos externos }) export class Ejemplo {} 
```

### 1.9.3 Leer `ejemplo.ts` línea a línea 

```         
// 1. Se importan solo las piezas que se usan. import { Component, computed, effect, signal } from '@angular/core'; import { ButtonModule } from 'primeng/button'; import { CardModule } from 'primeng/card'; import { InputTextModule } from 'primeng/inputtext'; import { MessageModule } from 'primeng/message'; import { TagModule } from 'primeng/tag';  // 2. El objeto que se muestra y se modifica. export interface Producto {   nombre: string;   precio: number;   activo: boolean; }  // 3. @Component describe CÓMO se pinta la clase. @Component({   host: { class: 'block' },              // <app-ejemplo> se comporta como bloque   selector: 'app-ejemplo',               // se usa como <app-ejemplo></app-ejemplo>   imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],   templateUrl: './ejemplo.html',   styleUrl: './ejemplo.css', }) export class Ejemplo {   // 4. ESTADO: el signal guarda un objeto completo.   protected readonly producto = signal<Producto>(productoInicial());    // 5. DERIVADOS: se calculan desde `producto()`, nunca se asignan.   protected readonly precioFinal = computed(() =>     Math.round(this.producto().precio * 1.19),   );   protected readonly estadoTexto = computed(() =>     this.producto().activo ? 'Activo' : 'Inactivo',   );    // 6. EFECTO: se ejecuta al crear y en cada cambio del objeto.   private readonly registro = effect(() => {     const { nombre, precio, activo } = this.producto();     console.log(`[ejemplo] ${nombre} · precio ${precio} · ${activo ? 'activo' : 'inactivo'}`);   });    // 7. Métodos que la plantilla llama desde los eventos.   protected cambiarNombre(event: Event): void {     const nombre = (event.target as HTMLInputElement).value;     this.producto.update((actual) => ({ ...actual, nombre }));   }    protected variarPrecio(delta: number): void {     this.producto.update((actual) => ({       ...actual,       precio: Math.max(0, actual.precio + delta),     }));   }    protected alternarEstado(): void {     this.producto.update((actual) => ({ ...actual, activo: !actual.activo }));   }    protected reiniciar(): void {     this.producto.set(productoInicial());   } } 
```

La función auxiliar evita compartir el mismo objeto entre el estado inicial y el reinicio:

```         
function productoInicial(): Producto {   return { nombre: 'Café molido 500 g', precio: 18000, activo: true }; } 
```

Las piezas de la plantilla que producen lo que se ve:

```         
<!-- 1. Interpolación: muestra un campo del objeto. --> <p class="text-2xl font-bold text-slate-900">{{ producto().precio }}</p>  <!-- 2. Property binding + event binding sobre un campo editable. --> <input pInputText [value]="producto().nombre" (input)="cambiarNombre($event)" />  <!-- 3. Event binding con argumento: el botón llama al método con 1000. --> <button pButton type="button" (click)="variarPrecio(1000)">   <span pButtonLabel>+1000</span> </button>  <!-- 4. Property binding booleano: el tag cambia de color según `activo`. --> <p-tag [value]="estadoTexto()" [severity]="producto().activo ? 'success' : 'danger'" /> 
```

### 1.9.4 Las cuatro formas de conectar la clase con el HTML

```         
@if (producto().activo) {   <p-message severity="success" variant="simple">     Producto activo: la API lo devolvería en <code>GET /api/productos</code>.   </p-message> } @else {   <p-message severity="warn" variant="simple">     Producto inactivo: el borrado lógico lo oculta de las listas.   </p-message> }  <!-- El mismo bloque aplica a una lista del negocio. --> @if (clients().length === 0) {   <p>No hay clientes activos.</p> } @else {   <ul>     @for (client of clients(); track client.id) {       <li>{{ client.name }}</li>     }   </ul> } 
```

### 1.9.5 Signals: el estado que avisa a la vista

**Dónde está en `Ejemplo`.** El estado es un objeto `Producto`; la plantilla lee sus campos y los botones lo cambian:

```         
// ejemplo.ts — declaración y cambios del estado protected readonly producto = signal<Producto>(productoInicial());  protected variarPrecio(delta: number): void {   this.producto.update((actual) => ({     ...actual,                              // conserva nombre y activo     precio: Math.max(0, actual.precio + delta),   })); }  protected reiniciar(): void {   this.producto.set(productoInicial());     // valor nuevo, no depende del anterior } 
```

```         
<!-- ejemplo.html — lectura del signal: siempre con paréntesis --> <p class="text-2xl font-bold text-slate-900">{{ producto().precio }}</p> <p class="text-sm text-slate-500">   Precio final con IVA (19 %): <strong>{{ precioFinal() }}</strong> </p> <p-tag [value]="estadoTexto()" [severity]="producto().activo ? 'success' : 'danger'" /> 
```

#### **Actualizar un objeto dentro de un signal**

Este es el punto que más se equivoca al empezar. Un signal compara **referencias**, no campos: si se modifica el objeto en el sitio, el signal sigue apuntando al mismo objeto y la vista **no se entera**.

```         
// MAL: muta el objeto y conserva la misma referencia. const actual = this.producto(); actual.precio = actual.precio + 1000;   // el signal no notifica: nadie llamó a set/update  // BIEN: crea un objeto nuevo y entrégaselo al signal. this.producto.update((actual) => ({ ...actual, precio: actual.precio + 1000 })); 
```

```         
// MAL: muta el objeto y conserva la misma referencia. const actual = this.producto(); actual.precio = actual.precio + 1000;   // el signal no notifica: nadie llamó a set/update  // BIEN: crea un objeto nuevo y entrégaselo al signal. this.producto.update((actual) => ({ ...actual, precio: actual.precio + 1000 })); 
```
