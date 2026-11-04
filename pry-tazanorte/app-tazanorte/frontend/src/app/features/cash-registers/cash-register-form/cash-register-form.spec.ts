import { TestBed } from '@angular/core/testing';
import {
  CashRegister,
  CashRegisterPayload,
} from '../../../core/models/cash-register.model';
import { Employee } from '../../../core/models/employee.model';
import { CashRegisterForm } from './cash-register-form';

const EMPLEADOS: Employee[] = [
  { id: 1, nombre: 'María Rodríguez', descripcion: null, is_active: true },
  { id: 2, nombre: 'Carlos Ruiz', descripcion: null, is_active: true },
];

const TURNO: CashRegister = {
  id: 7,
  nombre: 'Turno mañana',
  descripcion: 'Caja principal',
  empleado_id: 2,
  is_active: true,
};

describe('CashRegisterForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CashRegisterForm] }).compileComponents();
  });

  async function crearFormulario() {
    const fixture = TestBed.createComponent(CashRegisterForm);
    fixture.componentRef.setInput('employees', EMPLEADOS);
    await fixture.whenStable();
    const emitidos: CashRegisterPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitidos.push(payload));
    return { fixture, form: fixture.componentInstance, emitidos };
  }

  it('should block the submit when no employee is chosen', async () => {
    const { form, emitidos } = await crearFormulario();

    form.form.patchValue({ nombre: 'Turno tarde' });
    form.submit();

    expect(emitidos).toEqual([]);
    expect(form.form.controls.empleado_id.touched).toBe(true);
  });

  it('should send empleado_id as a number, not the whole employee object', async () => {
    const { form, emitidos } = await crearFormulario();

    form.form.patchValue({ nombre: ' Turno tarde ', empleado_id: 1 });
    form.submit();

    expect(emitidos).toEqual([{ nombre: 'Turno tarde', descripcion: null, empleado_id: 1 }]);
    expect(typeof emitidos[0].empleado_id).toBe('number');
  });

  it('should keep the selected employee when editing', async () => {
    const { fixture, form } = await crearFormulario();

    fixture.componentRef.setInput('cashRegister', TURNO);
    await fixture.whenStable();

    expect(form.form.controls.empleado_id.value).toBe(2);
    expect(form.form.controls.nombre.value).toBe('Turno mañana');
  });
});
