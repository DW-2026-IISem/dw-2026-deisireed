/**
 * Entorno de producción (`ng build`).
 *
 * `apiUrl` termina en `/api` SIN slash final: con uno, las llamadas saldrían
 * como `//clientes` y Express las trataría como otra ruta.
 *
 * `requireAuth`: mitad frontal del interruptor de fases. Nadie lo lee hasta
 * ISS-08 (Fase II).
 *
 * `primeUiLicense`: clave Community de PrimeUI (PrimeNG 22), personal y nominal.
 */
export const environment = {
  production: true,
  appName: 'TazaNorte',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense:
    'eyJpZCI6IjY4OWJlNTc3LWYyNDAtNGM4Ni05ZDJkLWU5OTMwNTg4MWU1ZiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTM2NTIxNzMsImV4cCI6MTgyNTE4ODE3M30.zwTG2h-xGOSOa8WC1wy0jrWmjQ0MyUYuLrawWO5sAtevsxHDerUcjJrNYVVWkgXinsG4h51C4DMhGBzTcJ0pAg',
};
