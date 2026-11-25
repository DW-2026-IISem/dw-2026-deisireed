import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, of } from 'rxjs';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User, UserPayload } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleUserApi } from '../../role-users/role-user-api';
import { UserApi } from '../user-api';
import { UserForm } from '../user-form/user-form';

@Component({
  host: { class: 'block' },
  selector: 'app-user-list',
  imports: [
    FormsModule,
    AvatarModule,
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    PasswordModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    UserForm,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly assignmentsApi = inject(RoleUserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  readonly session = inject(SessionStore);

  readonly rows = signal<User[]>([]);
  readonly assignments = signal<RoleUser[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** user_id → nombres de rol activos (columna ROL del PDF). */
  readonly rolesByUser = computed(() => {
    const map = new Map<number, string[]>();
    for (const a of this.assignments()) {
      if (a.status !== 'active') continue;
      map.set(a.user_id, [...(map.get(a.user_id) ?? []), a.role?.name ?? `Rol #${a.role_id}`]);
    }
    return map;
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (u) => [
      u.username,
      u.email,
      ...(this.rolesByUser().get(u.id) ?? []),
    ]),
  );

  // Crear / editar
  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar usuario' : 'Nuevo usuario'));

  // Ver permisos
  readonly accessVisible = signal(false);
  readonly accessUser = signal<User | null>(null);
  readonly access = signal<EffectivePermission[]>([]);
  readonly accessLoading = signal(false);
  readonly accessRoles = computed(() => [...new Set(this.access().map((p) => p.role_name))].sort());

  // Cambiar mi contraseña
  readonly passwordVisible = signal(false);
  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly passwordError = signal<string | null>(null);

  protected readonly methodSeverity = methodSeverity;

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      users: this.api.list(),
      // SUPERVISOR consulta usuarios pero no asignaciones: evita el 403.
      assignments: this.session.canPermission('GET /api/asignaciones-rol')
        ? this.assignmentsApi.list()
        : of([] as RoleUser[]),
    }).subscribe({
      next: ({ users, assignments }) => {
        this.rows.set(users);
        this.assignments.set(assignments);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  initials(user: User): string {
    return user.username.slice(0, 2).toUpperCase();
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  openEdit(user: User): void {
    this.editing.set(user);
    this.resetKey.update((k) => k + 1);
    this.dialogVisible.set(true);
  }

  save(payload: UserPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          current ? 'Usuario actualizado' : 'Usuario creado',
          current ? undefined : 'Asígnale un rol en «Asignaciones».',
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  showPermissions(user: User): void {
    this.accessUser.set(user);
    this.access.set([]);
    this.accessLoading.set(true);
    this.accessVisible.set(true);
    this.api.permissions(user.id).subscribe({
      next: (permissions) => {
        this.access.set(permissions);
        this.accessLoading.set(false);
      },
      error: (error: unknown) => {
        this.accessLoading.set(false);
        this.notify.error('No se pudieron cargar los permisos', toApiMessage(error));
      },
    });
  }

  openPassword(): void {
    this.currentPassword.set('');
    this.newPassword.set('');
    this.confirmPassword.set('');
    this.passwordError.set(null);
    this.passwordVisible.set(true);
  }

  savePassword(): void {
    const me = this.session.user();
    if (!me) return;
    if (!this.currentPassword() || this.newPassword().length < 8) {
      this.passwordError.set('Escribe la contraseña actual y una nueva de al menos 8 caracteres.');
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.passwordError.set('La confirmación no coincide.');
      return;
    }
    this.saving.set(true);
    this.passwordError.set(null);
    this.api
      .changePassword(me.id, {
        current_password: this.currentPassword(),
        new_password: this.newPassword(),
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.passwordVisible.set(false);
          this.notify.success('Contraseña actualizada');
        },
        error: (error: unknown) => {
          this.saving.set(false);
          this.passwordError.set(toApiMessage(error));
        },
      });
  }

  deactivate(user: User): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar a ${user.username}? Pierde el acceso en su siguiente petición.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () =>
        this.api.deactivate(user.id).subscribe({
          next: () => {
            this.notify.warn('Usuario desactivado');
            this.load();
          },
          error: (error: unknown) =>
            this.notify.error('No se pudo desactivar', toApiMessage(error)),
        }),
    });
  }

  remove(user: User): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${user.username}. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(user.id).subscribe({
          next: () => {
            this.notify.success('Usuario eliminado');
            this.load();
          },
          error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
        }),
    });
  }
}
