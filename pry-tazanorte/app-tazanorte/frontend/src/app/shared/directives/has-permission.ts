import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

/**
 * Pinta el elemento solo si la sesión tiene el permiso.
 *   <button *appHasPermission="'POST /api/clientes'" …>
 * `effect()` reacciona a `permissions()`: tras «Actualizar permisos» aparece/desaparece solo.
 */
@Directive({ selector: '[appHasPermission]' })
export class HasPermission {
  private readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private readonly session = inject(SessionStore);

  readonly appHasPermission = input.required<string>();

  private rendered = false;

  constructor() {
    effect(() => {
      const allowed = this.session.canPermission(this.appHasPermission());
      if (allowed && !this.rendered) {
        this.container.createEmbeddedView(this.template);
        this.rendered = true;
      } else if (!allowed && this.rendered) {
        this.container.clear();
        this.rendered = false;
      }
    });
  }
}
