import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import {
  CashRegister,
  CashRegisterPayload,
} from '../../../core/models/cash-register.model';
import { Employee } from '../../../core/models/employee.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { EmployeeApi } from '../../employees/employee-api';
import { CashRegisterApi } from '../cash-register-api';
import { CashRegisterForm } from '../cash-register-form/cash-register-form';

@Component({
  host: { class: 'block' },
  selector: 'app-cash-register-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    CashRegisterForm,
  ],
  templateUrl: './cash-register-list.html',
  styleUrl: './cash-register-list.css',
})
export class CashRegisterList {
  private readonly api = inject(CashRegisterApi);
  private readonly employeesApi = inject(EmployeeApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<CashRegister[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /**
   * Mapa id → nombre del empleado. `computed` lo reconstruye solo cuando cambian
   * los empleados, y devuelve una función que resuelve cada fila sin recorrer
   * el arreglo (evita O(n²)). Si el empleado ya no está activo, muestra su id.
   */
  readonly employeeName = computed(() => {
    const names = new Map(this.employees().map((employee) => [employee.id, employee.nombre]));
    return (id: number) => names.get(id) ?? `Empleado #${id}`;
  });

  readonly visibleRows = computed(() => {
    const name = this.employeeName();
    return filterRows(this.rows(), this.filter(), (row) => [
      row.nombre,
      row.descripcion,
      name(row.empleado_id),
    ]);
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<CashRegister | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar turno' : 'Nuevo turno'));

  constructor() {
    this.load();
  }

  /** Turnos y empleados en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      registers: this.api.list(),
      employees: this.employeesApi.list(),
    }).subscribe({
      next: ({ registers, employees }) => {
        this.rows.set(registers);
        this.employees.set(employees);
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
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(register: CashRegister): void {
    this.editing.set(register);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  save(payload: CashRegisterPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Turno actualizado' : 'Turno creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        // Aquí llegan los errores de la relación: «Employee must be active», etc.
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(register: CashRegister): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el turno «${register.nombre}»?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(register.id).subscribe({
          next: () => {
            this.notify.warn('Turno desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  remove(register: CashRegister): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el turno «${register.nombre}». Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(register.id).subscribe({
          next: () => {
            this.notify.success('Turno eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
