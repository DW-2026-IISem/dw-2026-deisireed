import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
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
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  readonly items: MenuItem[] = [
    { label: 'Panel', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Pedidos', icon: 'pi pi-shopping-cart', routerLink: '/pedidos' },
    { label: 'Detalle de pedidos', icon: 'pi pi-list', routerLink: '/detalle-pedidos' },
    { label: 'Productos', icon: 'pi pi-box', routerLink: '/productos' },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: '/clientes' },
    { label: 'Empleados', icon: 'pi pi-id-card', routerLink: '/empleados' },
    { label: 'Turnos de caja', icon: 'pi pi-clock', routerLink: '/turnos-caja' },
  ];

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }
}
