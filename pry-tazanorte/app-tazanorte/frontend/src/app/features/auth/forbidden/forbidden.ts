import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SessionStore } from '../../../core/services/session-store';

@Component({
  host: { class: 'block' },
  selector: 'app-forbidden',
  imports: [RouterLink, ButtonModule],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {
  private readonly route = inject(ActivatedRoute);
  readonly session = inject(SessionStore);
  readonly permission = this.route.snapshot.queryParamMap.get('permission');
}
