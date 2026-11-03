import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ejemplo } from './ejemplo';

describe('Ejemplo', () => {
  let fixture: ComponentFixture<Ejemplo>;
  let component: Ejemplo;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ejemplo] }).compileComponents();
    fixture = TestBed.createComponent(Ejemplo);
    component = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('muestra el precio inicial y su valor con IVA', () => {
    expect(el.textContent).toContain('Café molido 500 g');
    expect(el.textContent).toContain('18000');
    expect(el.textContent).toContain('21420');
  });

  it('suma 1000 al precio y recalcula el IVA', async () => {
    component['variarPrecio'](1000);
    await fixture.whenStable();
    expect(el.textContent).toContain('19000');
    expect(el.textContent).toContain('22610');
  });

  it('actualiza el nombre desde el campo', async () => {
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = 'Café en grano 1 kg';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.textContent).toContain('Vista previa: Café en grano 1 kg');
  });

  it('alterna el estado y reinicia el objeto', async () => {
    component['alternarEstado']();
    await fixture.whenStable();
    expect(el.textContent).toContain('Inactivo');

    component['reiniciar']();
    await fixture.whenStable();
    expect(el.textContent).not.toContain('Inactivo');
    expect(el.textContent).toContain('18000');
  });
});
