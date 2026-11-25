import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import {
  HTTP_METHODS,
  HttpMethod,
  Resource,
  ResourcePayload,
} from '../../../../core/models/resource.model';

@Component({
  host: { class: 'block' },
  selector: 'app-resource-form',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule, SelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  readonly resource = input<Resource | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<ResourcePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly methods = HTTP_METHODS.map((m) => ({ label: m, value: m }));
  readonly statusOptions = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    method: ['GET' as HttpMethod, [Validators.required]],
    path: ['', [Validators.required, Validators.pattern(/^\/\S*$/)]],
    description: [''],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      this.resetKey();
      this.form.reset({
        method: current?.method ?? 'GET',
        path: current?.path ?? '/api/',
        description: current?.description ?? '',
        status: current?.status ?? 'active',
      });
      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      method: value.method,
      path: value.path.trim(),
      description: value.description.trim() || null,
      ...(this.resource() ? {} : { status: value.status }),
    });
  }
}
