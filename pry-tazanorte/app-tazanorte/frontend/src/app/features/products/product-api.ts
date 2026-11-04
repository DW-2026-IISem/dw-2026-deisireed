import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductPayload } from '../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/productos`;

  list(): Observable<Product[]> {
    return this.http
      .get<{ products: Product[] }>(this.base)
      .pipe(map((response) => response.products));
  }

  get(id: number): Observable<Product> {
    return this.http
      .get<{ product: Product }>(`${this.base}/${id}`)
      .pipe(map((response) => response.product));
  }

  create(payload: ProductPayload): Observable<Product> {
    return this.http
      .post<{ product: Product }>(this.base, payload)
      .pipe(map((response) => response.product));
  }

  update(id: number, payload: Partial<Omit<ProductPayload, 'is_active'>>): Observable<Product> {
    return this.http
      .patch<{ product: Product }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.product));
  }

  replace(id: number, payload: Omit<ProductPayload, 'is_active'>): Observable<Product> {
    return this.http
      .put<{ product: Product }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.product));
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
