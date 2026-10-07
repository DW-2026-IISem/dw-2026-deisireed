/**
 * Coincidencia entre la ruta de una petición y un recurso almacenado como patrón.
 *   Patrón:   GET /api/productos/:id
 *   Petición: GET /api/productos/42
 * Reglas: mismo verbo, mismo número de segmentos, `:param` casa con un segmento.
 */

/** Normaliza una ruta: sin query, sin barra final, sin `//`. */
export function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  const single = withoutQuery.replace(/\/{2,}/g, "/");
  const trimmed = single.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** `true` si `path` (concreto) casa con `pattern` (con `:param`). */
export function pathMatches(pattern: string, path: string): boolean {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = normalizePath(path).split("/");

  if (patternParts.length !== pathParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    if (p.startsWith(":")) continue;
    if (p !== pathParts[i]) return false;
  }
  return true;
}

/** Decisión final del RBAC. Deny by default: sin coincidencia -> false. */
export function isOperationGranted(
  granted: ReadonlyArray<{ method: string; path: string }>,
  method: string,
  path: string
): boolean {
  const upper = method.toUpperCase();
  return granted.some(
    (resource) => resource.method.toUpperCase() === upper && pathMatches(resource.path, path)
  );
}
