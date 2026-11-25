import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { SessionStore } from '../../core/services/session-store';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  readonly session = inject(SessionStore);

  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  /** Menú estático; ISS-09 lo filtra por permisos. */
  readonly items: MenuItem[] = [
    { label: 'Panel', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Pedidos', icon: 'pi pi-shopping-cart', routerLink: '/pedidos' },
    { label: 'Detalle de pedidos', icon: 'pi pi-list', routerLink: '/detalle-pedidos' },
    { label: 'Productos', icon: 'pi pi-box', routerLink: '/productos' },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: '/clientes' },
    { label: 'Empleados', icon: 'pi pi-id-card', routerLink: '/empleados' },
    { label: 'Turnos de caja', icon: 'pi pi-clock', routerLink: '/turnos-caja' },
  ];

  readonly username = computed(() => this.session.user()?.username ?? '');

  readonly userItems = computed<MenuItem[]>(() => [
    { label: 'Mi perfil', icon: 'pi pi-user', routerLink: '/perfil' },
    { label: 'Actualizar permisos', icon: 'pi pi-sync', command: () => this.syncAccess() },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ]);

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  syncAccess(): void {
    this.auth.me().subscribe({
      next: () => this.notify.success('Permisos actualizados'),
      error: () => this.notify.error('No se pudieron actualizar los permisos'),
    });
  }

  logout(): void {
    this.mobileOpen.set(false);
    this.auth.logout().subscribe(() => {
      this.notify.info('Sesión cerrada');
      void this.router.navigate(['/login']);
    });
  }
}
