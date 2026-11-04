import { TestBed } from '@angular/core/testing';
import { Client, ClientPayload } from '../../../core/models/client.model';
import { ClientForm } from './client-form';

const CLIENTE: Client = {
  id: 1,
  tipo_documento: 'CE',
  numero_documento: '1001',
  nombre: 'Ana Pérez',
  telefono: '3000000000',
  email: 'ana@correo.com',
  is_active: true,
};

describe('ClientForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ClientForm] }).compileComponents();
  });

  async function crearFormulario() {
    const fixture = TestBed.createComponent(ClientForm);
    await fixture.whenStable();
    const emitidos: ClientPayload[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitidos.push(payload));
    return { fixture, form: fixture.componentInstance, emitidos };
  }

  it('should not emit while the form is invalid', async () => {
    const { form, emitidos } = await crearFormulario();

    form.submit();

    expect(emitidos).toEqual([]);
    expect(form.form.controls.nombre.touched).toBe(true);
  });

  it('should emit a trimmed payload without is_active', async () => {
    const { form, emitidos } = await crearFormulario();

    form.form.patchValue({ numero_documento: ' 1001 ', nombre: ' Ana ' });
    form.submit();

    expect(emitidos).toEqual([
      {
        tipo_documento: 'CC',
        numero_documento: '1001',
        nombre: 'Ana',
        telefono: null,
        email: null,
      },
    ]);
    expect('is_active' in emitidos[0]).toBe(false);
  });

  it('should load the client into the form when editing', async () => {
    const { fixture, form } = await crearFormulario();

    fixture.componentRef.setInput('client', CLIENTE);
    await fixture.whenStable();

    expect(form.form.controls.nombre.value).toBe('Ana Pérez');
    expect(form.form.controls.tipo_documento.value).toBe('CE');
  });
});
