import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { HttpMethod, Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

type ResourceRef = { method: HttpMethod; path: string; description: string | null };

@Component({
  host: { class: 'block' },
  selector: 'app-resource-role-list',
  imports: [
    FormsModule,
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly route = inject(ActivatedRoute);

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  /** `/admin/permisos?rol=3` llega filtrado desde la pantalla de Roles. */
  readonly roleFilter = signal<number | null>(
    Number(this.route.snapshot.queryParamMap.get('rol')) || null,
  );

  protected readonly methodSeverity = methodSeverity;

  readonly roleName = computed(() => {
    const map = new Map(this.roles().map((r) => [r.id, r.name]));
    return (id: number) => map.get(id) ?? `Rol #${id}`;
  });

  readonly resourceById = computed(() => new Map(this.resources().map((r) => [r.id, r])));

  readonly activeRoles = computed(() => this.roles().filter((r) => r.status === 'active'));

  readonly visibleRows = computed(() => {
    const role = this.roleFilter();
    const base = role ? this.rows().filter((g) => g.role_id === role) : this.rows();
    return filterRows(base, this.filter(), (g) => {
      const r = this.resourceOf(g);
      return [r?.method, r?.path, r?.description, this.roleName()(g.role_id)];
    });
  });

  // Diálogo «Conceder permiso»
  readonly dialogVisible = signal(false);
  readonly selectedRoleId = signal<number | null>(null);
  readonly selectedResource = signal<Resource | null>(null);

  /** Recursos activos que el rol elegido todavía no tiene. */
  readonly availableResources = computed(() => {
    const role = this.selectedRoleId();
    const granted = new Set(
      this.rows()
        .filter((g) => g.role_id === role && g.status === 'active')
        .map((g) => g.resource_id),
    );
    return this.resources().filter((r) => r.status === 'active' && !granted.has(r.id));
  });

  readonly canSave = computed(
    () => this.selectedRoleId() !== null && this.selectedResource() !== null && !this.saving(),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      rows: this.api.list(),
      roles: this.rolesApi.list(),
      resources: this.resourcesApi.list(),
    }).subscribe({
      next: ({ rows, roles, resources }) => {
        this.rows.set(rows);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  resourceOf(grant: ResourceRole): ResourceRef | null {
    return grant.resource ?? this.resourceById().get(grant.resource_id) ?? null;
  }

  openCreate(): void {
    this.selectedRoleId.set(this.roleFilter());
    this.selectedResource.set(null);
    this.dialogVisible.set(true);
  }

  save(): void {
    const role_id = this.selectedRoleId();
    const resource = this.selectedResource();
    if (role_id === null || !resource) return;
    this.saving.set(true);
    this.api.create({ role_id, resource_id: resource.id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          'Permiso concedido',
          `${resource.method} ${resource.path} → ${this.roleName()(role_id)}`,
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo conceder', toApiMessage(error));
      },
    });
  }

  revoke(grant: ResourceRole): void {
    const r = this.resourceOf(grant);
    this.confirmation.confirm({
      header: 'Revocar permiso',
      message: `¿Quitar ${r?.method} ${r?.path} al rol ${this.roleName()(grant.role_id)}? Aplica en la siguiente petición.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Revocar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(grant.id).subscribe({
          next: () => {
            this.notify.warn('Permiso revocado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo revocar', toApiMessage(error)),
        }),
    });
  }

  reactivate(grant: ResourceRole): void {
    this.api.reactivate(grant.id).subscribe({
      next: () => {
        this.notify.success('Permiso reactivado');
        this.load();
      },
      error: (error: unknown) => this.notify.error('No se pudo reactivar', toApiMessage(error)),
    });
  }
}
