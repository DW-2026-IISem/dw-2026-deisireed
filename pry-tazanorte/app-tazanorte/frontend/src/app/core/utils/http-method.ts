export type TagSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary';

/** Semáforo de métodos: GET azul, POST verde, PUT/PATCH ámbar, DELETE rojo. */
export function methodSeverity(method: string | null | undefined): TagSeverity {
  switch (method) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warn';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
}
