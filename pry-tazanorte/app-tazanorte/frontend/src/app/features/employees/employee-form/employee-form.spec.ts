import { TestBed } from '@angular/core/testing';
import { Employee, EmployeePayload } from '../../../core/models/employee.model';
import { EmployeeForm } from './employee-form';

const EMPLEADO: Employee = {
  id: 1,
  nombre: 'María Rodríguez',
  descripcion: 'Barista',
  is_active: true,
};

describe('EmployeeForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EmployeeForm] }).compileComponents();
  });

  async function crearFormulario() {
    const fixture = TestBed.createComponent(EmployeeForm);
    await fixture.whenStable();
    const emitidos: EmployeePayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitidos.push(payload));
    return { fixture, form: fixture.componentInstance, emitidos };
  }

  it('should not emit while the name is empty', async () => {
    const { form, emitidos } = await crearFormulario();

    form.submit();

    expect(emitidos).toEqual([]);
    expect(form.form.controls.nombre.touched).toBe(true);
  });

  it('should reject a name longer than 255 characters', async () => {
    const { form, emitidos } = await crearFormulario();

    form.form.patchValue({ nombre: 'a'.repeat(256) });
    form.submit();

    expect(emitidos).toEqual([]);
  });

  it('should emit a trimmed payload', async () => {
    const { form, emitidos } = await crearFormulario();

    form.form.patchValue({ nombre: ' Ana ', descripcion: '  ' });
    form.submit();

    expect(emitidos).toEqual([{ nombre: 'Ana', descripcion: null }]);
  });

  it('should load the employee into the form when editing', async () => {
    const { fixture, form } = await crearFormulario();

    fixture.componentRef.setInput('employee', EMPLEADO);
    await fixture.whenStable();

    expect(form.form.controls.nombre.value).toBe('María Rodríguez');
    expect(form.form.controls.descripcion.value).toBe('Barista');
  });
});
