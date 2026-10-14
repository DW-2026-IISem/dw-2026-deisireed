export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refresh_token: string;
}

export interface LogoutDto {
  refresh_token: string;
}

export interface SessionResponseDto {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
}
