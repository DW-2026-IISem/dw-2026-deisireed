import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supply, SupplyPayload } from '../../core/models/supply.model';

@Injectable({ providedIn: 'root' })
export class SupplyApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/insumos`;

  list(): Observable<Supply[]> {
    return this.http
      .get<{ supplies: Supply[] }>(this.base)
      .pipe(map((response) => response.supplies));
  }

  get(id: number): Observable<Supply> {
    return this.http
      .get<{ supply: Supply }>(`${this.base}/${id}`)
      .pipe(map((response) => response.supply));
  }

  create(payload: SupplyPayload): Observable<Supply> {
    return this.http
      .post<{ supply: Supply }>(this.base, payload)
      .pipe(map((response) => response.supply));
  }

  update(id: number, payload: Partial<Omit<SupplyPayload, 'is_active'>>): Observable<Supply> {
    return this.http
      .patch<{ supply: Supply }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.supply));
  }

  replace(id: number, payload: Omit<SupplyPayload, 'is_active'>): Observable<Supply> {
    return this.http
      .put<{ supply: Supply }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.supply));
  }

  /** Baja lógica: is_active = false. */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Baja física: DELETE. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
