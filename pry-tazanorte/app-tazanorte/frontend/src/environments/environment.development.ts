/**
 * En el día a día es **este** archivo el que importa Angular (vía
 * `fileReplacements`). Misma `primeUiLicense` que en producción.
 */
export const environment = {
  production: false,
  appName: 'TazaNorte',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense:
    'eyJpZCI6IjY4OWJlNTc3LWYyNDAtNGM4Ni05ZDJkLWU5OTMwNTg4MWU1ZiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTM2NTIxNzMsImV4cCI6MTgyNTE4ODE3M30.zwTG2h-xGOSOa8WC1wy0jrWmjQ0MyUYuLrawWO5sAtevsxHDerUcjJrNYVVWkgXinsG4h51C4DMhGBzTcJ0pAg',
};
