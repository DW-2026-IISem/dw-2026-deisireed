/**
 * @openapi
 * tags:
 *   - name: Session
 *     description: Autenticación y administración de sesiones.
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *
 *     RefreshRequest:
 *       type: object
 *       required: [refresh_token]
 *       properties:
 *         refresh_token:
 *           type: string
 *
 * /api/auth/login:
 *   post:
 *     tags: [Session]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Sesión iniciada
 *       '400':
 *         description: Solicitud inválida
 *       '401':
 *         description: Credenciales inválidas
 *
 * /api/auth/refresh:
 *   post:
 *     tags: [Session]
 *     summary: Renovar access token y refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       '200':
 *         description: Tokens renovados
 *       '401':
 *         description: Refresh token inválido o expirado
 *
 * /api/auth/logout:
 *   post:
 *     tags: [Session]
 *     summary: Revocar una sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       '200':
 *         description: Sesión revocada
 *
 * /api/auth/me:
 *   get:
 *     tags: [Session]
 *     summary: Consultar el perfil autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Perfil del usuario
 *       '401':
 *         description: Token inválido o ausente
 */
export {};
