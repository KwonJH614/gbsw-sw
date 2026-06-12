import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { authApi } from './api/auth.api';
import { useAuthStore } from './store/authStore';

function AuthInit() {
  const { accessToken, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    authApi.getMe()
      .then(res => setUser(res.data.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  return null;
}

export default function App() {
  return (
    <>
      <AuthInit />
      <AppRouter />
    </>
  );
}
