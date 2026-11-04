import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { Employee, EmployeePayload } from '../../../core/models/employee.model';

/**
 * Formulario de empleado, reutilizado para crear y editar.
 * No llama a la API: emite el payload y el padre decide entre POST y PATCH.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-employee-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm {
  readonly employee = input<Employee | null>(null);

  /** Llave para reiniciar el formulario al reabrir «Nuevo empleado». */
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<EmployeePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    descripcion: ['', [Validators.maxLength(255)]],
  });

  constructor() {
    effect(() => {
      const current = this.employee();
      this.resetKey(); // reabrir el diálogo debe vaciar el formulario

      this.form.reset({
        nombre: current?.nombre ?? '',
        descripcion: current?.descripcion ?? '',
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim() || null,
    });
  }
}
