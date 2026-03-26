import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';
import { isAxiosError } from 'axios';

export function useAuth() {
  const navigate = useNavigate();
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(data);
      const { accessToken, user } = res.data.data;
      storeLogin(user, accessToken);
      navigate('/');
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      navigate('/login');
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 로그아웃 실패해도 클라이언트 상태는 초기화
    } finally {
      storeLogout();
      navigate('/login');
    }
  };

  return { login, register, logout, loading, error, setError };
}
