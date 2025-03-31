export interface JwtPayload {
  id: number;
  name: string;
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}
