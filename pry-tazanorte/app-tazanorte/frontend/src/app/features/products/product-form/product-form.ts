import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TextareaModule } from 'primeng/textarea';
import { Product, ProductPayload } from '../../../core/models/product.model';

/** Formulario de producto: crear y editar. No llama a la API; emite el payload. */
@Component({
  host: { class: 'block' },
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    TextareaModule,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  readonly product = input<Product | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<ProductPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    sku: ['', [Validators.required, Validators.maxLength(50)]],
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    descripcion: ['', [Validators.maxLength(500)]],
    precio: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      const current = this.product();
      this.resetKey();
      this.form.reset({
        sku: current?.sku ?? '',
        nombre: current?.nombre ?? '',
        descripcion: current?.descripcion ?? '',
        precio: Number(current?.precio ?? 0),
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    // `is_active` no se envía: el backend crea en true y solo cambia con /deactivate.
    this.saved.emit({
      sku: value.sku.trim(),
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim() || null,
      precio: Number(value.precio),
    });
  }
}
