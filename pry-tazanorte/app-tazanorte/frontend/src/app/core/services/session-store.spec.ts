import { TestBed } from '@angular/core/testing';
import { EffectivePermission } from '../models/auth.model';
import { SessionStore } from './session-store';

const USER = {
  id: 2,
  username: 'caja',
  email: 'caja@tazanorte.local',
  avatar: null,
  status: 'active' as const,
};

function perm(permission: string, role = 'CAJA'): EffectivePermission {
  const [method, path] = permission.split(' ');
  return {
    resource_id: 1,
    method: method as EffectivePermission['method'],
    path,
    description: null,
    role_id: 2,
    role_name: role,
  };
}

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(SessionStore);
  });

  afterEach(() => store.clear());

  it('should deny by default when there are no permissions', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.canPermission('GET /api/clientes')).toBe(false);
  });

  it('should match :id patterns exactly', () => {
    store.setAccess({ user: USER, permissions: [perm('PATCH /api/pedidos/:id/estado')] });
    expect(store.can('PATCH', '/api/pedidos/7/estado')).toBe(true);
    expect(store.can('PATCH', '/api/pedidos/7')).toBe(false);
    expect(store.can('GET', '/api/pedidos/7/estado')).toBe(false);
  });

  it('should derive roles, label and initials', () => {
    store.setAccess({
      user: USER,
      permissions: [perm('GET /api/clientes'), perm('GET /api/productos', 'BARISTA')],
    });
    expect(store.roleNames()).toEqual(['BARISTA', 'CAJA']);
    expect(store.roleLabel()).toBe('BARISTA · CAJA');
    expect(store.initials()).toBe('CA');
    expect(store.hasRole('caja')).toBe(true);
  });

  it('should persist and restore the session from localStorage', () => {
    store.setTokens({
      access_token: 'a1',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'r1',
      refresh_expires_in: 604800,
    });
    store.setAccess({ user: USER, permissions: [perm('GET /api/clientes')] });

    const raw = JSON.parse(localStorage.getItem('tazanorte.session.v1') ?? '{}');
    expect(raw.accessToken).toBe('a1');

    TestBed.resetTestingModule();
    const restored = TestBed.inject(SessionStore);
    expect(restored.isAuthenticated()).toBe(true);
    expect(restored.refreshToken()).toBe('r1');
    expect(restored.permissionCount()).toBe(1);
  });

  it('should clear tokens, user, permissions and storage', () => {
    store.setTokens({
      access_token: 'a1',
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: 'r1',
      refresh_expires_in: 604800,
    });
    store.clear();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.user()).toBeNull();
    expect(localStorage.getItem('tazanorte.session.v1')).toBeNull();
  });
});
