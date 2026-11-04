import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Client, ClientPayload } from '../../../core/models/client.model';

/**
 * Formulario de cliente, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `client` (o `null` para crear) y emite el payload
 * con `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-client-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css',
})
export class ClientForm {
  /** Cliente a editar. `null` deja el formulario en modo creación. */
  readonly client = input<Client | null>(null);

  /**
   * Cambia cada vez que el padre abre el diálogo. Sin esto, reabrir «Nuevo
   * cliente» tras cancelar conservaría lo escrito: `client` sigue siendo `null`
   * y el `effect()` no volvería a correr.
   */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<ClientPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** Los mismos valores que genera el seeder del backend. */
  readonly documentTypes = [
    { label: 'Cédula de ciudadanía (CC)', value: 'CC' },
    { label: 'Cédula de extranjería (CE)', value: 'CE' },
    { label: 'Tarjeta de identidad (TI)', value: 'TI' },
    { label: 'Pasaporte (PP)', value: 'PP' },
  ];

  readonly form = this.fb.group({
    tipo_documento: ['CC', [Validators.required]],
    numero_documento: ['', [Validators.required, Validators.maxLength(30)]],
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    telefono: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email]],
  });

  constructor() {
    // `effect()` reacciona al input `client()`: el mismo formulario sirve para
    // crear y editar sin `ngOnChanges` ni comparar objetos a mano.
    effect(() => {
      const current = this.client();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el
      // formulario aunque `client` siga siendo `null`.
      this.resetKey();

      this.form.reset({
        tipo_documento: current?.tipo_documento ?? 'CC',
        numero_documento: current?.numero_documento ?? '',
        nombre: current?.nombre ?? '',
        telefono: current?.telefono ?? '',
        email: current?.email ?? '',
      });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    // `is_active` no se envía: el backend lo pone en true al crear y solo
    // cambia después con PATCH /deactivate.
    this.saved.emit({
      tipo_documento: value.tipo_documento,
      numero_documento: value.numero_documento.trim(),
      nombre: value.nombre.trim(),
      telefono: value.telefono.trim() || null,
      email: value.email.trim() || null,
    });
  }
}
