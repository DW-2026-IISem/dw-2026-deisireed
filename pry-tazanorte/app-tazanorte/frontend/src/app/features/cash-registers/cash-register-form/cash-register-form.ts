import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import {
  CashRegister,
  CashRegisterPayload,
} from '../../../core/models/cash-register.model';
import { Employee } from '../../../core/models/employee.model';

/**
 * Formulario de turno de caja, reutilizado para crear y editar.
 * Recibe la lista de empleados activos por `input()`; no la pide él mismo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-cash-register-form',
  imports: [
    MessageModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './cash-register-form.html',
  styleUrl: './cash-register-form.css',
})
export class CashRegisterForm {
  readonly cashRegister = input<CashRegister | null>(null);
  readonly employees = input<Employee[]>([]);

  /** Llave para reiniciar el formulario al reabrir «Nuevo turno». */
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<CashRegisterPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    descripcion: ['', [Validators.maxLength(255)]],
    empleado_id: [null as number | null, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.cashRegister();
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        descripcion: current?.descripcion ?? '',
        empleado_id: current?.empleado_id ?? null,
      });
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    // `empleado_id` es null mientras no se elige: sin esto TypeScript no
    // podría garantizar que el payload lleva un número.
    if (this.form.invalid || value.empleado_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit({
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim() || null,
      empleado_id: value.empleado_id,
    });
  }
}
