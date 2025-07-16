// import axios from 'axios';
// import { IRefreshToken } from '../interfaces/refresh-token.intrerface';
// import * as jwt from 'jsonwebtoken';
// import { LoginDto } from '../../dto/login.dto';
// import { iKeycloakLogin } from '../interfaces/keycloak-login.interface';
// import { ForbiddenException } from '@nestjs/common';
//
// export const loginFunc = async (dto: LoginDto): Promise<iKeycloakLogin> => {
//   const params = new URLSearchParams();
//   params.append('username', dto.username);
//   params.append('password', dto.password);
//   params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
//   params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
//   params.append('grant_type', process.env.KEYCLOAK_TYPE || 'password');
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//     const accessToken = response.data.access_token;
//     const refreshToken = response.data.refresh_token;
//     const decoded = jwt.decode(accessToken) as any;
//
//     const result = {
//       access_token: accessToken,
//       refresh_token: refreshToken,
//       expires_in: response.data.expires_in,
//       refresh_expires: response.data.refresh_expires_in,
//       user: {
//         username: decoded.preferred_username,
//         email: decoded.email,
//         roles: decoded.realm_access?.roles || [],
//       },
//     };
//
//     return result;
//   } catch (e) {
//     return e.message;
//   }
// };
//
// export const validateTokenFunc = async (token: string): Promise<boolean> => {
//   const params = new URLSearchParams();
//   params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
//   params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
//   params.append('token', token);
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token/introspect`,
//       params,
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       },
//     );
//     return response.data?.active || false;
//   } catch (err) {
//     console.log(err.message);
//     return false;
//   }
// };
//
// export const refreshTokenFunc = async (
//   rToken: string,
// ): Promise<IRefreshToken> => {
//   const params = new URLSearchParams();
//   params.append('refresh_token', rToken);
//   params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
//   params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
//   params.append('grant_type', 'refresh_token');
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`,
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//     const accessToken = response.data.access_token;
//     const refreshToken = response.data.refresh_token;
//     return {
//       accessToken,
//       refreshToken,
//       expires: response.data.expires_in,
//       expiresRefresh: response.data.refresh_expires_in,
//     };
//   } catch (err) {
//     throw new ForbiddenException();
//   }
// };
//
// export const logoutFunc = async (rToken: string): Promise<boolean> => {
//   const params = new URLSearchParams();
//   params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
//   params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
//   params.append('refresh_token', rToken);
//
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/logout`,
//       params,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//
//     return response.status === 204 ? true : false;
//   } catch (e) {
//     throw new ForbiddenException();
//   }
// };
//
// export const users = async (token: string): Promise<any> => {
//   try {
//     const response = await axios.get(
//       'http://10.151.146.245:9001/admin/realms/apbtest/users/',
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       },
//     );
//
//     return response.data;
//   } catch (e) {
//     throw new ForbiddenException();
//   }
// };
//
// export const userInfo = async (token: string): Promise<boolean> => {
//   const params = new URLSearchParams();
//   params.append('client_id', process.env.KEYCLOAK_CLIENT_ID || '');
//   params.append('client_secret', process.env.KEYCLOAK_SECRET || '');
//   params.append('token', token);
//
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token/introspect`,
//       params,
//       {
//         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       },
//     );
//     return response.data;
//   } catch (e) {
//     throw new ForbiddenException();
//   }
// };
