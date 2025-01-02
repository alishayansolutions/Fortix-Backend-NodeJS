export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  is_2fa_enabled: boolean;
  secret_2fa?: string;
  created_at: Date;
}

export interface AdminLoginDTO {
  username: string;
  password: string;
}

export interface Admin2FAVerifyDTO {
  token: string;
  code: string;
}
