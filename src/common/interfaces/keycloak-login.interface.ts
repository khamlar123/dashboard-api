export interface iKeycloakLogin {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires: number;
  user: {
    username: string;
    roles: string[];
  };
}
