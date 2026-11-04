import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { CashRegister } from '../../../core/models/cash-register.model';
import { Employee } from '../../../core/models/employee.model';
import { CashRegisterList } from './cash-register-list';

const BASE = `${environment.apiUrl}/turnos-caja`;
const EMPLOYEES_BASE = `${environment.apiUrl}/empleados`;

const EMPLEADOS: Employee[] = [
  { id: 1, nombre: 'María Rodríguez', descripcion: null, is_active: true },
  { id: 2, nombre: 'Carlos Ruiz', descripcion: null, is_active: true },
];

const TURNOS: CashRegister[] = [
  { id: 1, nombre: 'Turno mañana', descripcion: null, empleado_id: 1, is_active: true },
  { id: 2, nombre: 'Turno tarde', descripcion: 'Caja 2', empleado_id: 2, is_active: true },
];

describe('CashRegisterList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashRegisterList],
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

  /** El constructor pide turnos y empleados en paralelo: se responden los dos. */
  async function crearLista() {
    const fixture = TestBed.createComponent(CashRegisterList);
    http.expectOne(BASE).flush({ cash_registers: TURNOS });
    http.expectOne(EMPLOYEES_BASE).flush({ employees: EMPLEADOS });
    await fixture.whenStable();
    return { fixture, lista: fixture.componentInstance };
  }

  function recargar(): void {
    http.expectOne(BASE).flush({ cash_registers: TURNOS });
    http.expectOne(EMPLOYEES_BASE).flush({ employees: EMPLEADOS });
  }

  it('should load registers and employees in parallel', async () => {
    const { lista } = await crearLista();

    expect(lista.rows()).toEqual(TURNOS);
    expect(lista.employees()).toEqual(EMPLEADOS);
    expect(lista.loading()).toBe(false);
  });

  it('should resolve the employee name from the id', async () => {
    const { lista } = await crearLista();

    expect(lista.employeeName()(1)).toBe('María Rodríguez');
    expect(lista.employeeName()(99)).toBe('Empleado #99');
  });

  it('should filter by the employee name too', async () => {
    const { lista } = await crearLista();

    lista.filter.set('carlos');

    expect(lista.visibleRows()).toEqual([TURNOS[1]]);
  });

  it('should show the backend error when the employee is not active', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ nombre: 'Turno noche', empleado_id: 2 });

    http
      .expectOne(BASE)
      .flush({ error: 'Employee must be active' }, { status: 400, statusText: 'Bad Request' });

    expect(lista.saving()).toBe(false);
    expect(lista.dialogVisible()).toBe(true); // el diálogo sigue abierto
  });

  it('should PATCH the edited register keeping the numeric empleado_id', async () => {
    const { lista } = await crearLista();

    lista.openEdit(TURNOS[0]);
    lista.save({ nombre: 'Turno mañana 2', descripcion: null, empleado_id: 2 });

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual({
      nombre: 'Turno mañana 2',
      descripcion: null,
      empleado_id: 2,
    });
    cambio.flush({ cash_register: TURNOS[0] });

    recargar();
  });
});
