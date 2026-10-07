export interface LoginDto { email: string; password: string; }
export interface RefreshTokenDto { refresh_token: string; }
export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: { id: string; name: string; email: string; roles: string[]; };
}
