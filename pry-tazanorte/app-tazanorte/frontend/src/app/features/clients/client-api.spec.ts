import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Client } from '../../core/models/client.model';
import { ClientApi } from './client-api';

const BASE = `${environment.apiUrl}/clientes`;

const CLIENTE: Client = {
  id: 1,
  tipo_documento: 'CC',
  numero_documento: '1001',
  nombre: 'Ana Pérez',
  telefono: '3000000000',
  email: 'ana@correo.com',
  is_active: true,
};

describe('ClientApi', () => {
  let api: ClientApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ClientApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should unwrap { clients } into Client[]', () => {
    let resultado: Client[] | undefined;
    api.list().subscribe((clients) => (resultado = clients));

    const peticion = http.expectOne(BASE);
    expect(peticion.request.method).toBe('GET');
    peticion.flush({ clients: [CLIENTE] });

    expect(resultado).toEqual([CLIENTE]);
  });

  it('should build URLs from environment.apiUrl (no trailing slash)', () => {
    expect(environment.apiUrl.endsWith('/api')).toBe(true);
    api.list().subscribe();
    http.expectOne('http://localhost:4000/api/clientes').flush({ clients: [] });
  });

  it('should PATCH /deactivate for a logical delete', () => {
    api.deactivate(1).subscribe();
    const peticion = http.expectOne(`${BASE}/1/deactivate`);
    expect(peticion.request.method).toBe('PATCH');
    peticion.flush({ message: 'Client deactivated (logical delete)' });
  });
});
