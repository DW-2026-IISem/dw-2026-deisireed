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
import { NAV } from './nav.config';

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

  /** Se recalcula cuando cambian los permisos (login o «Actualizar permisos»). */
  readonly navGroups = computed<MenuItem[]>(() =>
    NAV.map((group) => ({
      label: group.label,
      expanded: true,
      items: group.items
        .filter((item) => !item.permission || this.session.canPermission(item.permission))
        .map<MenuItem>((item) => ({
          label: item.label,
          icon: item.icon,
          routerLink: item.routerLink,
          routerLinkActiveOptions: { exact: true },
        })),
    })).filter((group) => (group.items?.length ?? 0) > 0),
  );

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
