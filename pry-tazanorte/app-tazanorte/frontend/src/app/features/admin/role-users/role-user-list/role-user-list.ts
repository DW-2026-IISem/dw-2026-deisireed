import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

@Component({
  host: { class: 'block' },
  selector: 'app-role-user-list',
  imports: [
    DatePipe, FormsModule, ButtonModule, DialogModule, EmptyState, HasPermission, MessageModule,
    PageHeader, SelectModule, StatusTag, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly usersApi = inject(UserApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly userFilter = signal<number | null>(null);
  readonly roleFilter = signal<number | null>(null);

  readonly userById = computed(() => new Map(this.users().map((u) => [u.id, u])));
  readonly roleById = computed(() => new Map(this.roles().map((r) => [r.id, r])));

  readonly activeUsers = computed(() => this.users().filter((u) => u.status === 'active'));
  readonly activeRoles = computed(() => this.roles().filter((r) => r.status === 'active'));

  readonly visibleRows = computed(() => {
    const user = this.userFilter();
    const role = this.roleFilter();
    return this.rows().filter((r) => (!user || r.user_id === user) && (!role || r.role_id === role));
  });

  // Diálogo «Asignar rol»
  readonly dialogVisible = signal(false);
  readonly selectedUserId = signal<number | null>(null);
  readonly selectedRoleId = signal<number | null>(null);

  /** Roles que el usuario elegido todavía no tiene activos. */
  readonly availableRoles = computed(() => {
    const user = this.selectedUserId();
    const taken = new Set(
      this.rows().filter((r) => r.user_id === user && r.status === 'active').map((r) => r.role_id),
    );
    return this.activeRoles().filter((r) => !taken.has(r.id));
  });

  readonly canSave = computed(() => this.selectedUserId() !== null && this.selectedRoleId() !== null && !this.saving());

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({ rows: this.api.list(), users: this.usersApi.list(), roles: this.rolesApi.list() }).subscribe({
      next: ({ rows, users, roles }) => {
        this.rows.set(rows);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  username(row: RoleUser): string {
    return row.user?.username ?? this.userById().get(row.user_id)?.username ?? `Usuario #${row.user_id}`;
  }

  email(row: RoleUser): string {
    return row.user?.email ?? this.userById().get(row.user_id)?.email ?? '';
  }

  roleName(row: RoleUser): string {
    return row.role?.name ?? this.roleById().get(row.role_id)?.name ?? `Rol #${row.role_id}`;
  }

  openCreate(): void {
    this.selectedUserId.set(this.userFilter());
    this.selectedRoleId.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const user_id = this.selectedUserId();
    const role_id = this.selectedRoleId();
    if (user_id === null || role_id === null) return;
    this.saving.set(true);
    this.api.create({ user_id, role_id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Rol asignado', 'El usuario lo verá al pulsar «Actualizar permisos».');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo asignar', toApiMessage(error));
      },
    });
  }

  retire(row: RoleUser): void {
    const self = row.user_id === this.session.user()?.id;
    this.confirmation.confirm({
      header: self ? '⚠ Estás retirando tu propio rol' : 'Retirar rol',
      message: self
        ? `Vas a quitarte ${this.roleName(row)}. Si es tu único rol de administración, nadie podrá gestionar la seguridad.`
        : `¿Retirar ${this.roleName(row)} a ${this.username(row)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: self ? 'p-button-danger' : 'p-button-warning',
      accept: () =>
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Rol retirado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo retirar', toApiMessage(error)),
        }),
    });
  }

  reactivate(row: RoleUser): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notify.success('Asignación reactivada');
        this.load();
      },
      error: (error: unknown) => this.notify.error('No se pudo reactivar', toApiMessage(error)),
    });
  }
}
