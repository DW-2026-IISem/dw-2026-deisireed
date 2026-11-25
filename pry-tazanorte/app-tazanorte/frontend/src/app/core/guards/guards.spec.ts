import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { SessionStore } from '../services/session-store';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';
import { permissionGuard } from './permission-guard';

function run(guard: CanActivateFn, data: Record<string, unknown> = {}, url = '/pedidos') {
  const route = { data } as unknown as ActivatedRouteSnapshot;
  const state = { url } as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => guard(route, state));
}

function login(permissions: string[]): void {
  const store = TestBed.inject(SessionStore);
  store.setTokens({
    access_token: 'a',
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: 'r',
    refresh_expires_in: 1,
  });
  store.setAccess({
    user: {
      id: 1,
      username: 'admin',
      email: 'admin@tazanorte.local',
      avatar: null,
      status: 'active',
    },
    permissions: permissions.map((p, i) => {
      const [method, path] = p.split(' ');
      return {
        resource_id: i + 1,
        method: method as 'GET',
        path,
        description: null,
        role_id: 1,
        role_name: 'ADMIN',
      };
    }),
  });
}

describe('Guards', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => TestBed.inject(SessionStore).clear());

  it('authGuard should send a guest to /login with returnUrl', () => {
    const result = run(authGuard) as UrlTree;
    expect(result instanceof UrlTree).toBe(true);
    expect(result.root.children['primary'].segments[0].path).toBe('login');
    expect(result.queryParams['returnUrl']).toBe('/pedidos');
  });

  it('authGuard should let an authenticated user pass', () => {
    login([]);
    expect(run(authGuard)).toBe(true);
  });

  it('guestGuard should send an authenticated user away from /login', () => {
    login([]);
    expect(run(guestGuard) instanceof UrlTree).toBe(true);
  });

  it('permissionGuard should redirect to /forbidden with the missing permission', () => {
    login(['GET /api/productos']);
    const result = run(permissionGuard, { permission: 'GET /api/clientes' }) as UrlTree;
    expect(result.root.children['primary'].segments[0].path).toBe('forbidden');
    expect(result.queryParams['permission']).toBe('GET /api/clientes');
  });

  it('permissionGuard should allow a granted route', () => {
    login(['GET /api/clientes']);
    expect(run(permissionGuard, { permission: 'GET /api/clientes' })).toBe(true);
  });
});
