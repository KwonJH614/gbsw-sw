import client from './client';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '../types/auth.types';

export const authApi = {
  register: (data: RegisterRequest) =>
    client.post<ApiResponse<RegisterResponse>>('/auth/register', data),

  login: (data: LoginRequest) =>
    client.post<ApiResponse<LoginResponse>>('/auth/login', data),

  logout: () => client.post('/auth/logout'),

  refresh: () =>
    client.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  getMe: () => client.get<ApiResponse<User>>('/users/me'),

  updateMe: (data: { nickname: string }) =>
    client.patch<ApiResponse<User>>('/users/me', data),
};
