import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Client, ClientPayload } from '../../../core/models/client.model';
import { ClientList } from './client-list';

const BASE = `${environment.apiUrl}/clientes`;

const CLIENTES: Client[] = [
  {
    id: 1,
    tipo_documento: 'CC',
    numero_documento: '1001',
    nombre: 'Ana Pérez',
    telefono: '3000000000',
    email: 'ana@correo.com',
    is_active: true,
  },
  {
    id: 2,
    tipo_documento: 'CE',
    numero_documento: '2002',
    nombre: 'Luis Gómez',
    telefono: null,
    email: null,
    is_active: true,
  },
];

const PAYLOAD: ClientPayload = {
  tipo_documento: 'CC',
  numero_documento: '1001',
  nombre: 'Ana María Pérez',
};

describe('ClientList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientList],
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

  /** El constructor ya pide la lista: se responde de inmediato. */
  async function crearLista() {
    const fixture = TestBed.createComponent(ClientList);
    http.expectOne(BASE).flush({ clients: CLIENTES });
    await fixture.whenStable();
    return { fixture, lista: fixture.componentInstance };
  }

  /** Acepta el diálogo de confirmación sin abrirlo. */
  function aceptarConfirmacion(): void {
    TestBed.inject(ConfirmationService).requireConfirmation$.subscribe((confirmacion) =>
      confirmacion?.accept?.(),
    );
  }

  it('should load the clients on creation', async () => {
    const { lista } = await crearLista();

    expect(lista.rows()).toEqual(CLIENTES);
    expect(lista.loading()).toBe(false);
    expect(lista.error()).toBeNull();
  });

  it('should show the backend error message when the request fails', async () => {
    const fixture = TestBed.createComponent(ClientList);
    http
      .expectOne(BASE)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toContain('Missing Bearer token');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter rows locally with the search box', async () => {
    const { lista } = await crearLista();

    lista.filter.set('luis');

    expect(lista.visibleRows()).toEqual([CLIENTES[1]]);
  });

  it('should POST a new client and reload the list', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save(PAYLOAD);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(PAYLOAD);
    alta.flush({ client: CLIENTES[0] });

    http.expectOne(BASE).flush({ clients: CLIENTES }); // recarga posterior
  });

  it('should PATCH the edited client and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CLIENTES[0]);
    lista.save(PAYLOAD);

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual(PAYLOAD);
    expect('is_active' in cambio.request.body).toBe(false);
    cambio.flush({ client: CLIENTES[0] });

    http.expectOne(BASE).flush({ clients: CLIENTES });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(CLIENTES[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Client deactivated (logical delete)' });

    http.expectOne(BASE).flush({ clients: CLIENTES.slice(1) });
  });

  it('should DELETE the client after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.remove(CLIENTES[1]);

    const borrado = http.expectOne(`${BASE}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Client permanently deleted', id: 2 });

    http.expectOne(BASE).flush({ clients: [CLIENTES[0]] });
  });
});
