import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  host: { class: 'block' },
  selector: 'app-profile',
  imports: [AvatarModule, ButtonModule, CardModule, PageHeader, TableModule, TagModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly refreshing = signal(false);

  methodSeverity(method: string): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'success';
      case 'PUT':
      case 'PATCH':
        return 'warn';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /** GET /perfil + GET /permisos: refleja cambios de rol sin cerrar sesión. */
  refresh(): void {
    this.refreshing.set(true);
    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Sesión sincronizada', 'Perfil y permisos recargados.');
      },
      error: (error: unknown) => {
        this.refreshing.set(false);
        this.notify.error('No se pudo sincronizar', toApiMessage(error));
      },
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.notify.info('Sesión cerrada');
      void this.router.navigate(['/login']);
    });
  }
}
