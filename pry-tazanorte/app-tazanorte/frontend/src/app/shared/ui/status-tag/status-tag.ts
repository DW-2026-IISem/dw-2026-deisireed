import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

/** Etiqueta Activo/Inactivo a partir del booleano `is_active` del backend. */
@Component({
  host: { class: 'inline-block' },
  selector: 'app-status-tag',
  imports: [TagModule],
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.css',
})
export class StatusTag {
  readonly active = input.required<boolean>();

  readonly label = computed(() => (this.active() ? 'Activo' : 'Inactivo'));
  readonly severity = computed<'success' | 'danger'>(() =>
    this.active() ? 'success' : 'danger',
  );
}
