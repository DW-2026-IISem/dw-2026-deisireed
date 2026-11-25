import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Supply, SupplyPayload } from '../../../core/models/supply.model';

@Component({
  host: { class: 'block' },
  selector: 'app-supply-form',
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, InputTextModule, MessageModule, SelectModule],
  templateUrl: './supply-form.html',
  styleUrl: './supply-form.css',
})
export class SupplyForm {
  readonly supply = input<Supply | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<SupplyPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly units = ['g', 'kg', 'ml', 'L', 'und'].map((u) => ({ label: u, value: u }));

  readonly form = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    unidad_medida: ['und', [Validators.required, Validators.maxLength(20)]],
    stock_minimo: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const current = this.supply();
      this.resetKey();
      this.form.reset({
        codigo: current?.codigo ?? '',
        nombre: current?.nombre ?? '',
        unidad_medida: current?.unidad_medida ?? 'und',
        stock_minimo: Number(current?.stock_minimo ?? 0),
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
      codigo: value.codigo.trim().toUpperCase(),
      nombre: value.nombre.trim(),
      unidad_medida: value.unidad_medida.trim(),
      stock_minimo: Number(value.stock_minimo),
    });
  }
}
