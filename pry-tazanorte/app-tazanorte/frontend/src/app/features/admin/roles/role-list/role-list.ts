import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role, RolePayload } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceRoleApi } from '../../resource-roles/resource-role-api';
import { RoleUserApi } from '../../role-users/role-user-api';
import { RoleApi } from '../role-api';
import { RoleForm } from '../role-form/role-form';

function countBy<T>(rows: T[], key: (row: T) => number): Map<number, number> {
  const map = new Map<number, number>();
  for (const row of rows) map.set(key(row), (map.get(key(row)) ?? 0) + 1);
  return map;
}

@Component({
  host: { class: 'block' },
  selector: 'app-role-list',
  imports: [
    RouterLink, ButtonModule, DialogModule, EmptyState, HasPermission, InputTextModule, MessageModule,
    PageHeader, RoleForm, StatusTag, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  private readonly api = inject(RoleApi);
  private readonly assignmentsApi = inject(RoleUserApi);
  private readonly grantsApi = inject(ResourceRoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<Role[]>([]);
  readonly assignments = signal<RoleUser[]>([]);
  readonly grants = signal<ResourceRole[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly usersByRole = computed(() =>
    countBy(this.assignments().filter((a) => a.status === 'active'), (a) => a.role_id),
  );
  readonly grantsByRole = computed(() =>
    countBy(this.grants().filter((g) => g.status === 'active'), (g) => g.role_id),
  );

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (r) => [r.name, r.description]),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Role | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar rol' : 'Nuevo rol'));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      roles: this.api.list(),
      assignments: this.session.canPermission('GET /api/asignaciones-rol') ? this.assignmentsApi.list() : of([] as RoleUser[]),
      grants: this.session.canPermission('GET /api/concesiones-rol') ? this.grantsApi.list() : of([] as ResourceRole[]),
    }).subscribe({
      next: ({ roles, assignments, grants }) => {
        this.rows.set(roles);
        this.assignments.set(assignments);
        this.grants.set(grants);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  openEdit(role: Role): void {
    this.editing.set(role);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  save(payload: RolePayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Rol actualizado' : 'Rol creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(role: Role): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el rol ${role.name}? Sus ${this.usersByRole().get(role.id) ?? 0} usuarios pierden esos permisos.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(role.id).subscribe({
          next: () => {
            this.notify.warn('Rol desactivado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo desactivar', toApiMessage(error)),
        }),
    });
  }

  remove(role: Role): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el rol ${role.name}. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(role.id).subscribe({
          next: () => {
            this.notify.success('Rol eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        }),
    });
  }
}
