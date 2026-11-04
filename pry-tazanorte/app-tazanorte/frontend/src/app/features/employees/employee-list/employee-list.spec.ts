import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeList } from './employee-list';

const BASE = `${environment.apiUrl}/empleados`;

const EMPLEADOS: Employee[] = [
  { id: 1, nombre: 'María Rodríguez', descripcion: 'Barista', is_active: true },
  { id: 2, nombre: 'Carlos Ruiz', descripcion: null, is_active: true },
];

describe('EmployeeList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function crearLista() {
    const fixture = TestBed.createComponent(EmployeeList);
    http.expectOne(BASE).flush({ employees: EMPLEADOS });
    await fixture.whenStable();
    return { fixture, lista: fixture.componentInstance };
  }

  function aceptarConfirmacion(): void {
    TestBed.inject(ConfirmationService).requireConfirmation$.subscribe((confirmacion) =>
      confirmacion?.accept?.(),
    );
  }

  it('should load the employees on creation', async () => {
    const { lista } = await crearLista();

    expect(lista.rows()).toEqual(EMPLEADOS);
    expect(lista.loading()).toBe(false);
  });

  it('should filter by name and description', async () => {
    const { lista } = await crearLista();

    lista.filter.set('barista');
    expect(lista.visibleRows()).toEqual([EMPLEADOS[0]]);

    lista.filter.set('carlos');
    expect(lista.visibleRows()).toEqual([EMPLEADOS[1]]);
  });

  it('should POST a new employee and reload', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ nombre: 'Laura', descripcion: null });

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ nombre: 'Laura', descripcion: null });
    alta.flush({ employee: EMPLEADOS[0] });

    http.expectOne(BASE).flush({ employees: EMPLEADOS });
  });

  it('should PATCH the edited employee', async () => {
    const { lista } = await crearLista();

    lista.openEdit(EMPLEADOS[0]);
    lista.save({ nombre: 'María R.', descripcion: 'Barista' });

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in cambio.request.body).toBe(false);
    cambio.flush({ employee: EMPLEADOS[0] });

    http.expectOne(BASE).flush({ employees: EMPLEADOS });
  });

  it('should deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(EMPLEADOS[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Employee deactivated (logical delete)' });

    http.expectOne(BASE).flush({ employees: [EMPLEADOS[1]] });
  });
});
